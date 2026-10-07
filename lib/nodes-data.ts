import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "./db";
import { nodes, sensorReadings as r, settings } from "./db/schema";

const ONLINE_WINDOW_MS = 2 * 60 * 1000; // offline if no reading for 2 min
const TREND_WINDOW_MIN = 180; // matches your ~3h pressure history
const SAMPLE_MIN = 15; // averaging window at each end of the trend
const MQTT_TOPIC = "weathernode/data";

export type NodePrediction = "raining" | "rain-likely" | "clear" | "no-data";

export type NodeView = {
  id: string;
  name: string;
  location: string;
  topic: string;
  status: "online" | "offline";
  alerts: { level: "normal" | "warning" };
  prediction: NodePrediction;
  pressureDelta: number | null;
  lastSeen: string | null;
  latest: {
    pressure: number | null;
    humidity: number | null;
    temp: number | null;
    rainRaw: number | null;
    isRaining: boolean;
  } | null;
};

export type NodesData = {
  nodes: NodeView[];
  thresholds: {
    pressureDropHpa: number;
    humidityPct: number;
    multiNodeCheck: boolean;
    minNodesAgree: number;
  };
  stats: {
    total: number;
    online: number;
    offline: number;
    raining: number;
    predicting: number;
    rainExpected: boolean;
    avgPressure: number | null;
    avgHumidity: number | null;
    avgTemp: number | null;
    pressureDelta: number | null;
    trendWindowMin: number;
    readingsLastHour: number;
    avgIntervalSec: number | null;
    lastReadingAt: string | null;
  };
};

const DEFAULT_THRESHOLDS = {
  pressureDropHpa: 1.5,
  humidityPct: 75,
  multiNodeCheck: true,
  minNodesAgree: 2,
};

const avg = (xs: (number | null | undefined)[]) => {
  const v = xs.filter((x): x is number => typeof x === "number");
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};

async function avgPressureByNode(from: Date, to: Date) {
  const rows = await db
    .select({ nodeId: r.nodeId, v: sql<number | null>`avg(${r.pressure})::float` })
    .from(r)
    .where(and(gte(r.recordedAt, from), lt(r.recordedAt, to)))
    .groupBy(r.nodeId);
  return new Map(rows.map((x) => [x.nodeId, x.v]));
}

export async function getNodesData(): Promise<NodesData> {
  const now = Date.now();
  const min = 60 * 1000;

  const [allNodes, settingsRow] = await Promise.all([
    db.select().from(nodes),
    db.select().from(settings).where(eq(settings.id, "default")).limit(1),
  ]);

  const thresholds = settingsRow[0]
    ? {
        pressureDropHpa: settingsRow[0].pressureDropHpa,
        humidityPct: settingsRow[0].humidityPct,
        multiNodeCheck: settingsRow[0].multiNodeCheck,
        minNodesAgree: settingsRow[0].minNodesAgree,
      }
    : DEFAULT_THRESHOLDS;

  // newest reading per node
  const latestRows = await db
    .selectDistinctOn([r.nodeId])
    .from(r)
    .orderBy(r.nodeId, desc(r.recordedAt));
  const latestByNode = new Map(latestRows.map((row) => [row.nodeId, row]));

  // pressure trend per node: last SAMPLE_MIN avg vs. avg ~TREND_WINDOW_MIN ago
  const [recentP, pastP] = await Promise.all([
    avgPressureByNode(new Date(now - SAMPLE_MIN * min), new Date(now + min)),
    avgPressureByNode(
      new Date(now - (TREND_WINDOW_MIN + SAMPLE_MIN) * min),
      new Date(now - TREND_WINDOW_MIN * min),
    ),
  ]);

  const nodeViews: NodeView[] = allNodes.map((n) => {
    const row = latestByNode.get(n.id);
    const lastMs = row ? new Date(row.recordedAt).getTime() : null;
    const online = lastMs !== null && now - lastMs <= ONLINE_WINDOW_MS;

    const rp = recentP.get(n.id);
    const pp = pastP.get(n.id);
    const delta = rp != null && pp != null ? rp - pp : null;

    let prediction: NodePrediction = "no-data";
    if (online && row) {
      if (row.isRaining) prediction = "raining";
      else if (
        delta !== null &&
        delta <= -thresholds.pressureDropHpa &&
        (row.humidity ?? 0) >= thresholds.humidityPct
      )
        prediction = "rain-likely";
      else prediction = "clear";
    }

    return {
      id: n.id,
      name: n.name,
      location: n.location ?? "Unknown location",
      topic: MQTT_TOPIC,
      status: online ? "online" : "offline",
      alerts: { level: prediction === "raining" || prediction === "rain-likely" ? "warning" : "normal" },
      prediction,
      pressureDelta: delta,
      lastSeen: row ? new Date(row.recordedAt).toISOString() : null,
      latest: row
        ? {
            pressure: row.pressure,
            humidity: row.humidity,
            temp: row.temperature,
            rainRaw: row.rainRaw,
            isRaining: row.isRaining,
          }
        : null,
    };
  });

  const onlineNodes = nodeViews.filter((n) => n.status === "online");
  const predicting = onlineNodes.filter((n) => n.prediction === "rain-likely").length;
  const raining = onlineNodes.filter((n) => n.latest?.isRaining).length;
  const needed = thresholds.multiNodeCheck ? thresholds.minNodesAgree : 1;
  const rainExpected = raining > 0 || predicting >= needed;

  // reading frequency over the last hour
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(r)
    .where(gte(r.recordedAt, new Date(now - 60 * min)));
  const reporting = Math.max(onlineNodes.length, 1);
  const avgIntervalSec = count > 0 ? Math.round(3600 / (count / reporting)) : null;

  const lastMs = nodeViews.reduce(
    (m, n) => Math.max(m, n.lastSeen ? new Date(n.lastSeen).getTime() : 0),
    0,
  );

  return {
    nodes: nodeViews,
    thresholds,
    stats: {
      total: nodeViews.length,
      online: onlineNodes.length,
      offline: nodeViews.length - onlineNodes.length,
      raining,
      predicting,
      rainExpected,
      avgPressure: avg(onlineNodes.map((n) => n.latest?.pressure)),
      avgHumidity: avg(onlineNodes.map((n) => n.latest?.humidity)),
      avgTemp: avg(onlineNodes.map((n) => n.latest?.temp)),
      pressureDelta: avg(onlineNodes.map((n) => n.pressureDelta)),
      trendWindowMin: TREND_WINDOW_MIN,
      readingsLastHour: count,
      avgIntervalSec,
      lastReadingAt: lastMs ? new Date(lastMs).toISOString() : null,
    },
  };
}
