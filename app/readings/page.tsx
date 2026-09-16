"use client";

import { useState } from "react";

type NodeStatus = "ONLINE" | "DEGRADED";

type NodeData = {
  id: string;
  hardware: string;
  location: string;
  altitude: string;
  icon: string;
  temperature: string;
  temperatureTrend: string;
  humidity: number;
  dewPoint: string;
  pressure: string;
  pressureTrend: string;
  rain: string;
  rainDetail: string;
  battery: number;
  batteryDetail: string;
  signal: string;
  lastSync: string;
  status: NodeStatus;
  trend: "stable" | "falling" | "rising";
};

const nodes: NodeData[] = [
  {
    id: "HUB-GATEWAY-00",
    hardware: "ESP32-S3 WROOM • v2.4a",
    location: "Met Central Rig",
    altitude: "45.421°N, 9.182°E • 142m",
    icon: "router",
    temperature: "22.4°C",
    temperatureTrend: "+0.2° (1h)",
    humidity: 54,
    dewPoint: "12.6°C",
    pressure: "1014.8 hPa",
    pressureTrend: "-0.3 hPa (3h)",
    rain: "Dry 0.00 mm/h",
    rainDetail: "Resistance: >1.2MΩ",
    battery: 98,
    batteryDetail: "AC Main / Solar Float",
    signal: "-42 dBm",
    lastSync: "17:04:12 UTC",
    status: "ONLINE",
    trend: "stable",
  },
  {
    id: "NODE-01-NORTH",
    hardware: "Mast Ridge Station • v2.2",
    location: "Ridge Crest North",
    altitude: "45.438°N, 9.176°E • 288m",
    icon: "cell_tower",
    temperature: "19.8°C",
    temperatureTrend: "+0.6° (1h)",
    humidity: 68,
    dewPoint: "13.8°C",
    pressure: "1001.2 hPa",
    pressureTrend: "-1.8 hPa (3h)",
    rain: "Dry 0.00 mm/h",
    rainDetail: "Resistance: 990kΩ",
    battery: 82,
    batteryDetail: "4.08V • LiFePO4",
    signal: "-68 dBm",
    lastSync: "17:04:08 UTC",
    status: "ONLINE",
    trend: "falling",
  },
  {
    id: "NODE-02-SOUTH",
    hardware: "Valley Basin Unit • v2.2",
    location: "Valley Creek Basin",
    altitude: "45.412°N, 9.168°E • 94m",
    icon: "sensors",
    temperature: "23.1°C",
    temperatureTrend: "+1.1° (1h)",
    humidity: 79,
    dewPoint: "19.3°C",
    pressure: "1026.5 hPa",
    pressureTrend: "+0.2 hPa (3h)",
    rain: "Pre-droplets Alert",
    rainDetail: "Resistance: 820kΩ",
    battery: 38,
    batteryDetail: "3.68V • Heaters Active",
    signal: "-84 dBm",
    lastSync: "17:03:54 UTC",
    status: "DEGRADED",
    trend: "rising",
  },
];

function MetricCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendType = "neutral",
  progress,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: string;
  trend?: string;
  trendType?: "positive" | "warning" | "neutral";
  progress: number;
}) {
  const progressClass =
    trendType === "warning" ? "bg-amber-500" : "bg-cyan-600";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>

        <span className="material-symbols-outlined text-[18px] text-cyan-700">
          {icon}
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </span>

        {unit && (
          <span className="text-sm text-slate-400">
            {unit}
          </span>
        )}

        {trend && (
          <span
            className={`ml-auto flex items-center gap-0.5 text-[10px] font-semibold ${
              trendType === "warning"
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${progressClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function NodeCard({ node }: { node: NodeData }) {
  const isDegraded = node.status === "DEGRADED";

  return (
    <article
      className={`rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
        isDegraded
          ? "border-amber-200"
          : "border-slate-200"
      }`}
    >
      {/* Node header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
              isDegraded
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-cyan-100 bg-cyan-50 text-cyan-700"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {node.icon}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                {node.id}
              </h3>

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                  isDegraded
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isDegraded
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />

                {node.status}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              {node.hardware}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm font-medium text-slate-900">
            {node.location}
          </p>
          <p className="text-[10px] text-slate-500">
            {node.altitude}
          </p>
        </div>
      </div>

      {/* Main measurements */}
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
        <NodeMetric
          label="Temperature"
          value={node.temperature}
          detail={node.temperatureTrend}
          icon="device_thermostat"
        />

        <NodeMetric
          label="Humidity"
          value={`${node.humidity}%`}
          detail={`Dew ${node.dewPoint}`}
          icon="humidity_percentage"
          progress={node.humidity}
        />

        <NodeMetric
          label="Pressure"
          value={node.pressure}
          detail={node.pressureTrend}
          icon="speed"
        />

        <NodeMetric
          label="Rain Sensor"
          value={node.rain}
          detail={node.rainDetail}
          icon="water_drop"
          warning={isDegraded}
        />
      </div>

      {/* Bottom status row */}
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <StatusItem
            icon="battery_5_bar"
            label="Battery"
            value={`${node.battery}%`}
            warning={node.battery < 50}
          />

          <StatusItem
            icon="signal_cellular_alt"
            label="Signal"
            value={node.signal}
            warning={node.signal === "-84 dBm"}
          />

          <StatusItem
            icon="sync"
            label="Last sync"
            value={node.lastSync}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            60m trend
          </span>

          <TrendSparkline trend={node.trend} />
        </div>
      </div>
    </article>
  );
}

function NodeMetric({
  label,
  value,
  detail,
  icon,
  progress,
  warning = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
  progress?: number;
  warning?: boolean;
}) {
  return (
    <div className="min-w-0 p-4">
      <div className="flex items-center gap-1.5 text-slate-400">
        <span className="material-symbols-outlined text-[15px]">
          {icon}
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 truncate text-sm font-semibold ${
          warning ? "text-amber-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>

      {progress !== undefined ? (
        <div className="mt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                warning ? "bg-amber-500" : "bg-cyan-600"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-1 text-[10px] text-slate-500">
            {detail}
          </p>
        </div>
      ) : (
        <p className="mt-1 truncate text-[10px] text-slate-500">
          {detail}
        </p>
      )}
    </div>
  );
}

function StatusItem({
  icon,
  label,
  value,
  warning = false,
}: {
  icon: string;
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`material-symbols-outlined text-[16px] ${
          warning ? "text-amber-600" : "text-slate-400"
        }`}
      >
        {icon}
      </span>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p
          className={`text-xs font-semibold ${
            warning ? "text-amber-700" : "text-slate-700"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function TrendSparkline({
  trend,
}: {
  trend: "stable" | "falling" | "rising";
}) {
  const path =
    trend === "falling"
      ? "M0,7 Q20,10 40,15 T70,21 T96,25"
      : trend === "rising"
        ? "M0,24 Q20,22 40,17 T70,11 T96,5"
        : "M0,18 Q16,16 32,20 T64,12 T96,14";

  const color =
    trend === "falling"
      ? "text-amber-500"
      : trend === "rising"
        ? "text-cyan-600"
        : "text-cyan-600";

  return (
    <svg
      className={`h-7 w-24 overflow-visible ${color}`}
      viewBox="0 0 96 28"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />

      <circle
        cx="96"
        cy={trend === "falling" ? "25" : trend === "rising" ? "5" : "14"}
        r="2.5"
        fill="currentColor"
      />
    </svg>
  );
}

function DiagnosticPanel() {
  const diagnostics = [
    ["Packet Interval", "30.00 s", "Nominal Rate"],
    ["Sync Delta", "< 120 ms", "Jitter ±4ms"],
    ["Frame Integrity", "100.0%", "0 lost / 1,440 cyc"],
    ["Base QNH Ref", "1013.25", "WMO Baro Baseline"],
    ["Noise Floor", "-112 dBm", "SNR Clean (+8.2dB)"],
    ["P2P Routing Hop", "1 Hop", "Star-to-Mesh Hybrid"],
  ];

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-cyan-700">
            hub
          </span>

          <h2 className="text-sm font-semibold text-slate-900">
            Mesh Transport Diagnostics
          </h2>
        </div>

        <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          CRC-32 PASS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {diagnostics.map(([label, value, detail]) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200/80 bg-slate-50 p-3"
          >
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              {label}
            </p>

            <p
              className={`mt-1 text-sm font-semibold tabular-nums ${
                label === "Frame Integrity"
                  ? "text-emerald-600"
                  : "text-slate-900"
              }`}
            >
              {value}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-500">
              {detail}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-slate-900 p-3 font-mono text-[10px] leading-relaxed text-slate-300">
        <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-semibold text-slate-200">
            TX/RX STREAM BUFFER
          </span>

          <span className="font-medium text-emerald-400">
            BUFFER 100% HEALTH
          </span>
        </div>

        <p className="truncate">
          [17:04:12] RX ← HUB-GATEWAY-00: LEN=32 CRC=0x9A44 RSSI=-42dBm OK
        </p>

        <p className="truncate">
          [17:04:08] RX ← NODE-01-NORTH: LEN=32 CRC=0x83B1 RSSI=-68dBm OK
        </p>

        <p className="truncate font-semibold text-amber-400">
          [17:03:54] RX ← NODE-02-SOUTH: LEN=32 CRC=0x22F0 RSSI=-84dBm WARN
        </p>
      </div>
    </section>
  );
}

function PowerPanel() {
  const [tripped, setTripped] = useState(false);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">
            energy_savings_leaf
          </span>

          <h2 className="text-sm font-semibold text-slate-900">
            Power Management & Battery Rules
          </h2>
        </div>

        <span className="rounded border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-800">
          MPPT FLOAT
        </span>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-700">
              shield
            </span>

            <span className="text-sm font-semibold text-amber-900">
              Critical Threshold Fallback Policy
            </span>
          </div>

          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
            Armed
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-amber-900/85">
          Below{" "}
          <strong className="font-semibold text-amber-800">
            20% / 3.60V
          </strong>
          , the transceiver switches from 30s live streaming to{" "}
          <strong className="font-semibold text-slate-900">
            120s low-power beacon mode
          </strong>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <PowerMetric
          label="Solar Harvester Influx"
          value="+145 mA"
          detail="Active Float MPPT Tracking"
          icon="wb_sunny"
          type="positive"
        />

        <PowerMetric
          label="Node 02 Thermal Heater"
          value="-60 mA Draw"
          detail="Condensation Anti-Dew Cycle"
          icon="heat"
          type="warning"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-cyan-700">
            science
          </span>

          <div>
            <p className="text-xs font-semibold text-slate-800">
              Simulate Battery Protection
            </p>

            <p className="text-[10px] text-slate-500">
              Test Node 02 low-voltage fallback
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setTripped((current) => !current)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
            tripped
              ? "border-amber-600 bg-amber-600 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-cyan-600 hover:bg-cyan-700 hover:text-white"
          }`}
        >
          {tripped ? "Reset to 3.68V" : "Trigger 3.58V Trip"}
        </button>
      </div>

      {tripped && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          <span className="material-symbols-outlined text-[16px]">
            warning
          </span>

          Low-voltage protection triggered. Node 02 is now in beacon mode.
        </div>
      )}
    </section>
  );
}

function PowerMetric({
  label,
  value,
  detail,
  icon,
  type,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
  type: "positive" | "warning";
}) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>

        <span
          className={`material-symbols-outlined text-[16px] ${
            type === "warning"
              ? "text-amber-600"
              : "text-emerald-600"
          }`}
        >
          {icon}
        </span>
      </div>

      <p
        className={`mt-1 text-lg font-bold tabular-nums ${
          type === "warning"
            ? "text-amber-600"
            : "text-emerald-600"
        }`}
      >
        {value}
      </p>

      <p className="text-[10px] text-slate-500">
        {detail}
      </p>
    </div>
  );
}

export default function ReadingsPage() {
  const [activeNode, setActiveNode] = useState("All Nodes");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sort, setSort] = useState("realtime");

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        {/* FILTER / CONTROL BAR */}
        <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {[
              "All Nodes",
              "Master Hub",
              "Node 01 North",
              "Node 02 South",
            ].map((node) => (
              <button
                key={node}
                type="button"
                onClick={() => setActiveNode(node)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeNode === node
                    ? "bg-cyan-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {node}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold tracking-wider text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              STREAMING ACTIVE • 30s
            </div>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-cyan-500"
            >
              <option value="realtime">Latest Sync</option>
              <option value="gradient">Gradient Shift</option>
              <option value="battery">Battery Level</option>
            </select>

            <button
              type="button"
              onClick={() => setAutoRefresh((current) => !current)}
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium shadow-sm transition-colors ${
                autoRefresh
                  ? "border-slate-200 bg-white text-cyan-700"
                  : "border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  autoRefresh ? "animate-spin" : ""
                }`}
              >
                refresh
              </span>

              {autoRefresh ? "Auto (30s)" : "Paused"}
            </button>

            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-lg bg-cyan-700 px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-cyan-800"
            >
              <span className="material-symbols-outlined text-[16px]">
                file_download
              </span>

              CSV Export
            </button>
          </div>
        </section>

        {/* QUICK METRICS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Active Array Mean"
            value="21.8"
            unit="°C"
            icon="device_thermostat"
            trend="+0.4°/h"
            trendType="positive"
            progress={62}
          />

          <MetricCard
            label="Atmospheric Pressure"
            value="1014.18"
            unit="hPa"
            icon="speed"
            trend="-1.2 hPa"
            trendType="warning"
            progress={48}
          />

          <MetricCard
            label="Rainfall"
            value="0.00"
            unit="mm/h"
            icon="water_drop"
            trend="DRY BASE"
            trendType="positive"
            progress={4}
          />

          <MetricCard
            label="Energy Reserve"
            value="72.6"
            unit="% AVG"
            icon="battery_charging_full"
            trend="+145mA"
            trendType="positive"
            progress={72}
          />
        </section>

        {/* NODE TELEMETRY */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  Node Realtime Telemetry
                </h2>

                <span className="rounded border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-800">
                  LoRa 868M-CH3
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Live environmental readings from the distributed sensor array.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Frames Processed
              </p>

              <p className="text-sm font-semibold tabular-nums text-slate-900">
                84,192
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {nodes
              .filter((node) => {
                if (activeNode === "All Nodes") return true;
                if (activeNode === "Master Hub")
                  return node.id === "HUB-GATEWAY-00";
                if (activeNode === "Node 01 North")
                  return node.id === "NODE-01-NORTH";
                if (activeNode === "Node 02 South")
                  return node.id === "NODE-02-SOUTH";

                return true;
              })
              .map((node) => (
                <NodeCard key={node.id} node={node} />
              ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <span>
                Active Matrix:{" "}
                <strong className="text-slate-900">3/3 Responding</strong>
              </span>

              <span>
                Mesh Convergence:{" "}
                <strong className="text-emerald-700">48 ms</strong>
              </span>

              <span>
                Auto-sync:{" "}
                <strong className="text-slate-900">30s</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Payload Hash Verified
            </div>
          </div>
        </section>

        {/* DIAGNOSTICS */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DiagnosticPanel />
          <PowerPanel />
        </section>
      </div>
    </main>
  );
}
