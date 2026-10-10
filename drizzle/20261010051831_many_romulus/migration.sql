CREATE TABLE "nodes" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"location" text,
	"latitude" double precision,
	"longitude" double precision,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensor_readings" (
	"id" serial PRIMARY KEY,
	"node_id" text NOT NULL,
	"temperature" real,
	"pressure" real,
	"humidity" real,
	"rain_raw" integer,
	"is_raining" boolean,
	"status" text DEFAULT 'ok' NOT NULL,
	"prediction" text DEFAULT 'none' NOT NULL,
	"age_min" integer DEFAULT 0 NOT NULL,
	"bme_ok" boolean,
	"rain_ok" boolean,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" text PRIMARY KEY,
	"pressure_drop_hpa" real DEFAULT 1.5 NOT NULL,
	"humidity_pct" real DEFAULT 75 NOT NULL,
	"multi_node_check" boolean DEFAULT true NOT NULL,
	"min_nodes_agree" integer DEFAULT 2 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_sensor_readings_node_time" ON "sensor_readings" ("node_id","recorded_at" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_node_id_nodes_id_fkey" FOREIGN KEY ("node_id") REFERENCES "nodes"("id");