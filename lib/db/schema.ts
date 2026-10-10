import { pgTable, text, serial, real, integer, boolean, doublePrecision, timestamp, index } from "drizzle-orm/pg-core";

export const nodes = pgTable("nodes", {
  id: text("id").primaryKey(), // e.g. "node-01"
  name: text("name").notNull(),
  location: text("location"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sensorReadings = pgTable(
  "sensor_readings",
  {
    id: serial("id").primaryKey(),
    nodeId: text("node_id")
      .notNull()
      .references(() => nodes.id),

    // Sensor values (null on "no_readings" heartbeat messages)
    temperature: real("temperature"),
    pressure: real("pressure"),
    humidity: real("humidity"),
    rainRaw: integer("rain_raw"),
    isRaining: boolean("is_raining"), // now nullable: heartbeats carry no value

    // New fields from the payload
    status: text("status").notNull().default("ok"), // "ok" | "no_readings"
    prediction: text("prediction").notNull().default("none"),
    ageMin: integer("age_min").notNull().default(0), // minutes between sampling and publish
    bmeOk: boolean("bme_ok"),
    rainOk: boolean("rain_ok"),

    // When the sample was actually taken (receivedAt - ageMin)
    recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull(),
    // When the server received the message
    receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_sensor_readings_node_time").on(t.nodeId, t.recordedAt.desc())],
);

export const settings = pgTable("settings", {
  id: text("id").primaryKey(), // always "default"
  pressureDropHpa: real("pressure_drop_hpa").notNull().default(1.5),
  humidityPct: real("humidity_pct").notNull().default(75),
  multiNodeCheck: boolean("multi_node_check").notNull().default(true),
  minNodesAgree: integer("min_nodes_agree").notNull().default(2),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
