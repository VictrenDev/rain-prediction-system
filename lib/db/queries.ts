import { and, count, desc, eq, gte } from "drizzle-orm";
import { db } from "./index";
import { nodes, sensorReadings } from "./schema";
export const PAGE_SIZE = 30;

export const RANGES = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
} as const;

export type RangeKey = keyof typeof RANGES;

export function parseRange(value?: string): RangeKey {
  return value && value in RANGES ? (value as RangeKey) : "24h";
}

// Heartbeat rows (status = "no_readings") carry no sensor values.
// Every query that feeds readings tables, charts or predictions should use this.
export const validReading = eq(sensorReadings.status, "ok");

export async function getNodes() {
  return db.select().from(nodes).orderBy(nodes.id);
}

function readingFilters(nodeId: string | undefined, range: RangeKey) {
  const since = new Date(Date.now() - RANGES[range]);
  return and(
    validReading,
    gte(sensorReadings.recordedAt, since),
    nodeId ? eq(sensorReadings.nodeId, nodeId) : undefined,
  );
}

export async function countReadings({ nodeId, range }: { nodeId?: string; range: RangeKey }) {
  const [row] = await db.select({ total: count() }).from(sensorReadings).where(readingFilters(nodeId, range));
  return row.total;
}

export async function getReadings({
  nodeId,
  range,
  limit = PAGE_SIZE,
  offset = 0,
}: {
  nodeId?: string;
  range: RangeKey;
  limit?: number;
  offset?: number;
}) {
  return db
    .select({
      id: sensorReadings.id,
      recordedAt: sensorReadings.recordedAt,
      receivedAt: sensorReadings.receivedAt,
      nodeId: sensorReadings.nodeId,
      nodeName: nodes.name,
      temperature: sensorReadings.temperature,
      humidity: sensorReadings.humidity,
      pressure: sensorReadings.pressure,
      rainRaw: sensorReadings.rainRaw,
      isRaining: sensorReadings.isRaining, // boolean | null in the schema
      ageMin: sensorReadings.ageMin,
    })
    .from(sensorReadings)
    .innerJoin(nodes, eq(sensorReadings.nodeId, nodes.id))
    .where(readingFilters(nodeId, range))
    .orderBy(desc(sensorReadings.recordedAt), desc(sensorReadings.id))
    .limit(limit)
    .offset(offset);
}
