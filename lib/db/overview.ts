import { desc, eq, gte, max, min, sql } from "drizzle-orm";
import { db } from "./index";
import { sensorReadings, settings } from "./schema";
import type { Point, Thresholds } from "../prediction/engine";

export type ChartRange = "3h" | "24h" | "7d";

export const CHART_RANGES: Record<ChartRange, { ms: number; bin: string; binMs: number; label: string }> = {
  "3h": { ms: 3 * 3600e3, bin: "3 minutes", binMs: 3 * 60e3, label: "Last 3 Hours" },
  "24h": { ms: 24 * 3600e3, bin: "15 minutes", binMs: 15 * 60e3, label: "Last 24 Hours" },
  "7d": { ms: 7 * 24 * 3600e3, bin: "1 hour", binMs: 3600e3, label: "Last 7 Days" },
};

export function parseChartRange(v?: string): ChartRange {
  return v && v in CHART_RANGES ? (v as ChartRange) : "3h";
}

export const DEFAULT_SETTINGS: Thresholds = {
  pressureDropHpa: 1.5,
  humidityPct: 75,
  multiNodeCheck: true,
  minNodesAgree: 2,
};

export async function getSettings(): Promise<Thresholds> {
  const [row] = await db.select().from(settings).where(eq(settings.id, "default")).limit(1);
  if (!row) return DEFAULT_SETTINGS;
  return {
    pressureDropHpa: row.pressureDropHpa,
    humidityPct: row.humidityPct,
    multiNodeCheck: row.multiNodeCheck,
    minNodesAgree: row.minNodesAgree,
  };
}

/** Most recent reading for each node. */
export async function getLatestPerNode() {
  return db
    .selectDistinctOn([sensorReadings.nodeId], {
      nodeId: sensorReadings.nodeId,
      recordedAt: sensorReadings.recordedAt,
      temperature: sensorReadings.temperature,
      pressure: sensorReadings.pressure,
      humidity: sensorReadings.humidity,
      isRaining: sensorReadings.isRaining,
    })
    .from(sensorReadings)
    .orderBy(sensorReadings.nodeId, desc(sensorReadings.recordedAt));
}

export async function getTempRange24h(now: number) {
  const [row] = await db
    .select({ lo: min(sensorReadings.temperature), hi: max(sensorReadings.temperature) })
    .from(sensorReadings)
    .where(gte(sensorReadings.recordedAt, new Date(now - 24 * 3600e3)));
  return { lo: row?.lo ?? null, hi: row?.hi ?? null };
}

export type NodeSeries = {
  pressure: Point[];
  humidity: Point[];
  temperature: Point[];
};

type RawRow = {
  t: number | string;
  node_id: string;
  temperature: number | null;
  pressure: number | null;
  humidity: number | null;
};

/** Per-node averages in fixed time bins, so chart size stays bounded. */
export async function getSeries(range: ChartRange, now: number): Promise<Record<string, NodeSeries>> {
  const cfg = CHART_RANGES[range];
  const since = new Date(now - cfg.ms).toISOString();

  const res = await db.execute(sql`
    SELECT
      (extract(epoch FROM date_bin(${cfg.bin}::interval, recorded_at, TIMESTAMPTZ '2000-01-01 00:00:00+00')) * 1000)::float8 AS t,
      node_id,
      AVG(temperature)::float8 AS temperature,
      AVG(pressure)::float8 AS pressure,
      AVG(humidity)::float8 AS humidity
    FROM sensor_readings
    WHERE recorded_at >= ${since}::timestamptz
    GROUP BY 1, node_id
    ORDER BY 1
  `);

  const rows = (Array.isArray(res) ? res : (res as unknown as { rows: RawRow[] }).rows) as RawRow[];

  const out: Record<string, NodeSeries> = {};
  for (const r of rows) {
    const s = (out[r.node_id] ??= { pressure: [], humidity: [], temperature: [] });
    const t = Number(r.t);
    if (r.pressure != null) s.pressure.push({ t, v: Number(r.pressure) });
    if (r.humidity != null) s.humidity.push({ t, v: Number(r.humidity) });
    if (r.temperature != null) s.temperature.push({ t, v: Number(r.temperature) });
  }
  return out;
}
