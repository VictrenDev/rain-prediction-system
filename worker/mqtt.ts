import mqtt from "mqtt";
import { z } from "zod";
import { db } from "../lib/db";
import { nodes, sensorReadings } from "../lib/db/schema";

// Normal reading from the node
const readingSchema = z.object({
  node_id: z.string().min(1),
  temp: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  rain_raw: z.number().int(),
  is_raining: z.boolean(),
  prediction: z.string().default("none"),
  age_min: z.number().int().nonnegative().default(0),
  bme_ok: z.boolean().optional(),
  rain_ok: z.boolean().optional(),
});

// Heartbeat sent when the buffer is empty
const heartbeatSchema = z.object({
  node_id: z.string().min(1),
  status: z.literal("no_readings"),
  bme_ok: z.boolean().optional(),
  rain_ok: z.boolean().optional(),
});

// Heartbeat is checked first so it never gets rejected by the reading schema
const payloadSchema = z.union([heartbeatSchema, readingSchema]);

const topic = process.env.MQTT_TOPIC ?? "weathernode/data";

const client = mqtt.connect({
  protocol: "mqtts",
  host: process.env.MQTT_HOST!,
  port: Number(process.env.MQTT_PORT ?? 8883),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: `weather-worker-${Math.random().toString(16).slice(2, 8)}`,
  reconnectPeriod: 5000, // auto-reconnect every 5s
});

client.on("connect", () => {
  console.log("[mqtt] connected");
  client.subscribe(topic, { qos: 1 }, (err) => {
    if (err) console.error("[mqtt] subscribe failed:", err.message);
    else console.log(`[mqtt] subscribed to ${topic}`);
  });
});

client.on("message", async (_topic, message) => {
  try {
    const parsed = payloadSchema.safeParse(JSON.parse(message.toString()));
    if (!parsed.success) {
      console.warn("[mqtt] invalid payload:", parsed.error.flatten());
      return;
    }
    const d = parsed.data;
    const receivedAt = new Date();

    // auto-register unknown nodes so the foreign key never fails
    await db
      .insert(nodes)
      .values({ id: d.node_id, name: d.node_id })
      .onConflictDoNothing();

    if ("status" in d) {
      // Heartbeat: node is alive but has no readings
      await db.insert(sensorReadings).values({
        nodeId: d.node_id,
        status: d.status,
        prediction: "none",
        ageMin: 0,
        bmeOk: d.bme_ok ?? null,
        rainOk: d.rain_ok ?? null,
        recordedAt: receivedAt,
        receivedAt,
      });
      console.log(`[db] heartbeat ${d.node_id} | bme=${d.bme_ok} rain=${d.rain_ok}`);
      return;
    }

    // Back-date buffered readings to when they were actually sampled
    const recordedAt = new Date(receivedAt.getTime() - d.age_min * 60_000);

    await db.insert(sensorReadings).values({
      nodeId: d.node_id,
      temperature: d.temp,
      pressure: d.pressure,
      humidity: d.humidity,
      rainRaw: d.rain_raw,
      isRaining: d.is_raining,
      status: "ok",
      prediction: d.prediction,
      ageMin: d.age_min,
      bmeOk: d.bme_ok ?? null,
      rainOk: d.rain_ok ?? null,
      recordedAt,
      receivedAt,
    });

    console.log(
      `[db] saved ${d.node_id} | P=${d.pressure} H=${d.humidity} T=${d.temp} | age=${d.age_min}m`,
    );
  } catch (err) {
    console.error("[worker] failed to process message:", err);
  }
});

client.on("reconnect", () => console.log("[mqtt] reconnecting..."));
client.on("close", () => console.log("[mqtt] connection closed"));
client.on("error", (err) => console.error("[mqtt] error:", err.message));
