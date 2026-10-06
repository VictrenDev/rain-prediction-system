import mqtt from "mqtt";
import { z } from "zod";
import { db } from "../lib/db";
import { nodes, sensorReadings } from "../lib/db/schema";

const payloadSchema = z.object({
  node_id: z.string().min(1),
  temp: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  rain_raw: z.number().int(),
  is_raining: z.boolean(),
});

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
      console.warn("[mqtt] invalid payload:", parsed.error.flatten().fieldErrors);
      return;
    }
    const d = parsed.data;

    // auto-register unknown nodes so the foreign key never fails
    await db
      .insert(nodes)
      .values({ id: d.node_id, name: d.node_id })
      .onConflictDoNothing();

    await db.insert(sensorReadings).values({
      nodeId: d.node_id,
      temperature: d.temp,
      pressure: d.pressure,
      humidity: d.humidity,
      rainRaw: d.rain_raw,
      isRaining: d.is_raining,
    });

    console.log(`[db] saved ${d.node_id} | P=${d.pressure} H=${d.humidity} T=${d.temp}`);
  } catch (err) {
    console.error("[worker] failed to process message:", err);
  }
});

client.on("reconnect", () => console.log("[mqtt] reconnecting..."));
client.on("close", () => console.log("[mqtt] connection closed"));
client.on("error", (err) => console.error("[mqtt] error:", err.message));
