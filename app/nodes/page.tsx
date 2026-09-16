"use client";

import { useState } from "react";

type NodeStatus = "online" | "offline";
type AlertLevel = "normal" | "warning";

type SensorNode = {
  id: string;
  name: string;
  location: string;
  topic: string;
  status: NodeStatus;
  lastSeen: string;
  latencyMs: number;
  tempC: number;
  tempTrend: "steady" | "rising" | "falling";
  humidity: number;
  humidityTriggered: boolean;
  pressureHpa: number;
  pressureTrend: "steady" | "rising" | "falling-fast";
  pressureDeltaLabel: string;
  power: { type: "AC Mains" | "LiPo"; level: number };
  alerts: { count: number; label: string; level: AlertLevel };
};

const NODES: SensorNode[] = [
  {
    id: "node-00",
    name: "Master Hub",
    location: "Roof Station",
    topic: "sensors/hydro/hub-00",
    status: "online",
    lastSeen: "Just now",
    latencyMs: 11,
    tempC: 21.4,
    tempTrend: "steady",
    humidity: 84.0,
    humidityTriggered: true,
    pressureHpa: 1008.4,
    pressureTrend: "steady",
    pressureDeltaLabel: "Stable (+0.1 hPa/3h)",
    power: { type: "AC Mains", level: 100 },
    alerts: { count: 0, label: "Normal", level: "normal" },
  },
  {
    id: "node-01",
    name: "Node 1",
    location: "North Garden",
    topic: "sensors/hydro/node-01",
    status: "online",
    lastSeen: "12s ago",
    latencyMs: 14,
    tempC: 20.6,
    tempTrend: "steady",
    humidity: 85.1,
    humidityTriggered: true,
    pressureHpa: 1008.2,
    pressureTrend: "falling-fast",
    pressureDeltaLabel: "Falling Fast (-1.8 hPa)",
    power: { type: "LiPo", level: 82 },
    alerts: { count: 2, label: "2 Warnings Triggered", level: "warning" },
  },
  {
    id: "node-02",
    name: "Node 2",
    location: "South Valley",
    topic: "sensors/hydro/node-02",
    status: "online",
    lastSeen: "28s ago",
    latencyMs: 18,
    tempC: 19.8,
    tempTrend: "steady",
    humidity: 88.0,
    humidityTriggered: true,
    pressureHpa: 1008.9,
    pressureTrend: "steady",
    pressureDeltaLabel: "Normal",
    power: { type: "LiPo", level: 48 },
    alerts: { count: 1, label: "1 Alert (Humidity)", level: "warning" },
  },
];

type ThresholdRule = {
  title: string;
  description: string;
  icon: string;
  affectedLabel: string;
  affectedNodes: string;
  tagLabel: string;
  tagColor: "amber" | "slate" | "emerald";
  enabled: boolean;
};

const RULES: ThresholdRule[] = [
  {
    title: "Rapid Pressure Drop",
    description: "Triggers when pressure rate > 1.5 hPa drop in 3h.",
    icon: "trending_down",
    affectedLabel: "Active on:",
    affectedNodes: "Node 1 (-1.8 hPa)",
    tagLabel: "Storm Warning",
    tagColor: "amber",
    enabled: true,
  },
  {
    title: "High Humidity Threshold",
    description: "Alerts when air humidity reading exceeds 75% RH.",
    icon: "humidity_percentage",
    affectedLabel: "Triggered:",
    affectedNodes: "Node 1, Node 2",
    tagLabel: "Condensation Guard",
    tagColor: "emerald",
    enabled: true,
  },
  {
    title: "Low Battery Notification",
    description: "Warns when LiPo pack level falls below 20%.",
    icon: "battery_alert",
    affectedLabel: "Lowest:",
    affectedNodes: "Node 2 (48%)",
    tagLabel: "Battery Healthy",
    tagColor: "emerald",
    enabled: true,
  },
];

function StatusBadge({ status }: { status: NodeStatus }) {
  if (status === "online") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Online (MQTT)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      Offline
    </span>
  );
}

function AlertBadge({ alerts }: { alerts: SensorNode["alerts"] }) {
  if (alerts.level === "warning") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
        {alerts.label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold whitespace-nowrap">
      <span className="material-symbols-outlined text-[14px]">check_circle</span>
      {alerts.label}
    </span>
  );
}

function BatteryBar({ power }: { power: SensorNode["power"] }) {
  const barColor = power.level >= 60 ? "bg-emerald-500" : power.level >= 30 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="flex flex-col gap-1 w-full sm:w-28">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-slate-800 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-teal-600">
            {power.type === "AC Mains" ? "power" : "battery_5_bar"}
          </span>
          {power.type}
        </span>
        <span className={`font-bold ${power.level >= 60 ? "text-emerald-600" : power.level >= 30 ? "text-amber-700" : "text-rose-600"}`}>
          {power.level}%
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${power.level}%` }} />
      </div>
    </div>
  );
}

function TempCell({ node }: { node: SensorNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-bold text-slate-900">{node.tempC.toFixed(1)}°C</span>
      <span className="inline-flex items-center text-emerald-600 text-[11px] font-medium whitespace-nowrap">
        <span className="material-symbols-outlined text-[14px]">check</span>Steady
      </span>
    </div>
  );
}

function HumidityCell({ node }: { node: SensorNode }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={`text-sm font-bold ${node.humidityTriggered ? "text-amber-700" : "text-slate-900"}`}>
        {node.humidity.toFixed(1)}%
      </span>
      {node.humidityTriggered && (
        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold whitespace-nowrap">
          &gt;75% Trigger
        </span>
      )}
    </div>
  );
}

function PressureCell({ node }: { node: SensorNode }) {
  const isFalling = node.pressureTrend === "falling-fast";
  return (
    <div className="flex flex-col">
      <span className={`text-sm font-bold ${isFalling ? "text-amber-700" : "text-slate-900"}`}>
        {node.pressureHpa.toLocaleString(undefined, { minimumFractionDigits: 1 })}{" "}
        <span className="text-xs font-normal text-slate-500">hPa</span>
      </span>
      <span
        className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
          isFalling ? "text-amber-700 font-bold" : "text-emerald-600"
        }`}
      >
        {isFalling && <span className="material-symbols-outlined text-[13px]">arrow_downward</span>}
        {node.pressureDeltaLabel}
      </span>
    </div>
  );
}

function RuleTagColor(color: ThresholdRule["tagColor"]) {
  switch (color) {
    case "amber":
      return "text-amber-700";
    case "emerald":
      return "text-emerald-700";
    default:
      return "text-slate-700";
  }
}

export default function NodesPage() {
  const [filter, setFilter] = useState<"all" | "healthy" | "warnings" | "offline">("all");
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<SensorNode | null>(null);
  const [showAddNode, setShowAddNode] = useState(false);

  const filteredNodes = NODES.filter((n) => {
    const matchesSearch =
      search.trim() === "" ||
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.location.toLowerCase().includes(search.toLowerCase()) ||
      n.topic.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "healthy" && n.alerts.level === "normal") ||
      (filter === "warnings" && n.alerts.level === "warning") ||
      (filter === "offline" && n.status === "offline");

    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: NODES.length,
    healthy: NODES.filter((n) => n.alerts.level === "normal").length,
    warnings: NODES.filter((n) => n.alerts.level === "warning").length,
    offline: NODES.filter((n) => n.status === "offline").length,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full text-slate-900">
      {/* 4 METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-cyan-600/40 transition-colors">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-700 text-[20px]">hub</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Sensor Nodes
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              100% Online
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">3 Online</span>
              <span className="text-sm font-medium text-slate-500">/ 0 Offline</span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                check_circle
              </span>
              All nodes transmitting normally via MQTT
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Data transmission: <strong className="text-slate-800">Zero packets lost</strong>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-cyan-600/40 transition-colors">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 text-[20px]">
                battery_charging_full
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Station Battery Health
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold whitespace-nowrap">
              Healthy
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">Good (76%)</span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-teal-600">power</span>
              1 on AC Mains, 2 on LiPo Battery
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Lowest node: <strong className="text-amber-700 font-semibold">South Valley (48%)</strong>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-colors">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">warning</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Node Alerts
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              Attention
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-amber-700 tracking-tight">2 Warnings</span>
            </div>
            <p className="text-xs font-medium text-amber-700 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              Rapid pressure drop on North Garden
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Secondary alert: <strong className="text-amber-700 font-semibold">High humidity (88%)</strong>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-cyan-600/40 transition-colors">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-700 text-[20px]">sync</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                MQTT Data Frequency
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-bold whitespace-nowrap">
              Real-time
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">Every 30s</span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-cyan-700">cloud_sync</span>
              Automatic background sync active
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Broker latency: <strong className="text-slate-800">14 ms average</strong>
            </span>
          </div>
        </div>
      </div>

      {/* NODES TABLE / CARD LIST */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
            <div className="relative flex-1 max-w-md min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
                placeholder="Search nodes by name, location, or MQTT topic..."
                type="text"
              />
            </div>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs overflow-x-auto">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  filter === "all" ? "bg-white text-cyan-800 shadow-xs" : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
              >
                All Nodes{" "}
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px]">
                  {counts.all}
                </span>
              </button>
              <button
                onClick={() => setFilter("healthy")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  filter === "healthy" ? "bg-white text-cyan-800 font-bold shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Healthy{" "}
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                  {counts.healthy}
                </span>
              </button>
              <button
                onClick={() => setFilter("warnings")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  filter === "warnings" ? "bg-white text-amber-800 font-bold shadow-xs" : "text-amber-700 hover:text-amber-800"
                }`}
              >
                Warnings{" "}
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {counts.warnings}
                </span>
              </button>
              <button
                onClick={() => setFilter("offline")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  filter === "offline" ? "bg-white text-slate-800 font-bold shadow-xs" : "text-slate-400"
                }`}
              >
                Offline{" "}
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-500 text-[10px]">
                  {counts.offline}
                </span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export CSV</span>
            </button>
            <button
              className="h-9 px-3.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              type="button"
               onClick={() => setShowAddNode(true)}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>

              <span>Add Node</span>
            </button>
            {showAddNode && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setShowAddNode(false);
                  }
                }}
              >
                <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                          <span className="material-symbols-outlined text-[20px]">
                            sensors
                          </span>
                        </div>

                        <div>
                          <h2 className="text-base font-bold text-slate-900">
                            Add Sensor Node
                          </h2>
                          <p className="text-xs text-slate-500">
                            Register a new monitoring node
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddNode(false)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Close"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        close
                      </span>
                    </button>
                  </div>

                  {/* Form */}
                  <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">
                    <div className="space-y-5">
                      {/* Node Information */}
                      <section>
                        <div className="mb-3">
                          <h3 className="text-sm font-bold text-slate-900">
                            Node Information
                          </h3>
                          <p className="text-xs text-slate-500">
                            Basic details used to identify this node.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="node-name"
                              className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                              Node Name
                            </label>

                            <input
                              id="node-name"
                              type="text"
                              placeholder="e.g. Node 3"
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="node-id"
                              className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                              Node ID
                            </label>

                            <input
                              id="node-id"
                              type="text"
                              placeholder="e.g. node-03"
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="node-location"
                              className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                              Location
                            </label>

                            <input
                              id="node-location"
                              type="text"
                              placeholder="e.g. East Garden"
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />
                          </div>
                        </div>
                      </section>

                      {/* MQTT */}
                      <section className="border-t border-slate-100 pt-5">
                        <div className="mb-3">
                          <h3 className="text-sm font-bold text-slate-900">
                            MQTT Connection
                          </h3>
                          <p className="text-xs text-slate-500">
                            Topic used by the node to publish sensor readings.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="mqtt-topic"
                            className="mb-1.5 block text-xs font-semibold text-slate-700"
                          >
                            MQTT Topic
                          </label>

                          <input
                            id="mqtt-topic"
                            type="text"
                            placeholder="sensors/hydro/node-03"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                          />
                        </div>
                      </section>

                      {/* Sensors */}
                      <section className="border-t border-slate-100 pt-5">
                        <div className="mb-3">
                          <h3 className="text-sm font-bold text-slate-900">
                            Sensors
                          </h3>
                          <p className="text-xs text-slate-500">
                            Select the sensors available on this node.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {[
                            {
                              id: "sensor-temperature",
                              label: "Temperature",
                              icon: "device_thermostat",
                              checked: true,
                            },
                            {
                              id: "sensor-humidity",
                              label: "Humidity",
                              icon: "humidity_percentage",
                              checked: true,
                            },
                            {
                              id: "sensor-pressure",
                              label: "Air Pressure",
                              icon: "speed",
                              checked: true,
                            },
                            {
                              id: "sensor-rain",
                              label: "Rain Sensor",
                              icon: "rainy",
                              checked: true,
                            },
                          ].map((sensor) => (
                            <label
                              key={sensor.id}
                              htmlFor={sensor.id}
                              className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 transition-colors hover:border-cyan-200 hover:bg-cyan-50/40"
                            >
                              <input
                                id={sensor.id}
                                type="checkbox"
                                defaultChecked={sensor.checked}
                                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                              />

                              <span className="material-symbols-outlined text-[19px] text-slate-500">
                                {sensor.icon}
                              </span>

                              <span className="text-sm font-medium text-slate-700">
                                {sensor.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </section>

                      {/* Configuration */}
                      <section className="border-t border-slate-100 pt-5">
                        <div className="mb-3">
                          <h3 className="text-sm font-bold text-slate-900">
                            Node Configuration
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="power-source"
                              className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                              Power Source
                            </label>

                            <select
                              id="power-source"
                              defaultValue="LiPo"
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            >
                              <option value="LiPo">LiPo Battery</option>
                              <option value="AC Mains">AC Mains</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="data-interval"
                              className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                              Data Interval
                            </label>

                            <select
                              id="data-interval"
                              defaultValue="3"
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            >
                              <option value="30">30 seconds</option>
                              <option value="60">1 minute</option>
                              <option value="3">3 minutes</option>
                              <option value="5">5 minutes</option>
                              <option value="10">10 minutes</option>
                            </select>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                      type="button"
                      onClick={() => setShowAddNode(false)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        // Connect this to your API/database later.
                        setShowAddNode(false);
                      }}
                      className="rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-800"
                    >
                      Add Node
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP TABLE (md and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold select-none">
              <tr>
                <th className="py-3.5 px-4">Node &amp; Location</th>
                <th className="py-3.5 px-4">Connection &amp; MQTT</th>
                <th className="py-3.5 px-4">Temperature</th>
                <th className="py-3.5 px-4">Humidity</th>
                <th className="py-3.5 px-4">Air Pressure</th>
                <th className="py-3.5 px-4">Battery / Power</th>
                <th className="py-3.5 px-4">Alerts / Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredNodes.map((node) => (
                <tr
                  key={node.id}
                  className={`transition-colors group ${
                    node.alerts.level === "warning"
                      ? "bg-cyan-50/20 hover:bg-cyan-50/40"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 relative ${
                          node.status === "online" ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        {node.status === "online" && node.alerts.level === "warning" && (
                          <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{node.name}</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
                            {node.location}
                          </span>
                        </div>
                        <div className="text-slate-400 font-mono text-[11px] mt-0.5">{node.topic}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={node.status} />
                        <span className="text-slate-400 text-[11px]">{node.lastSeen}</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">
                        Latency: <strong className="text-slate-700">{node.latencyMs} ms</strong>
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <TempCell node={node} />
                  </td>
                  <td className="py-3.5 px-4">
                    <HumidityCell node={node} />
                  </td>
                  <td className="py-3.5 px-4">
                    <PressureCell node={node} />
                  </td>
                  <td className="py-3.5 px-4">
                    <BatteryBar power={node.power} />
                  </td>
                  <td className="py-3.5 px-4">
                    <AlertBadge alerts={node.alerts} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setSelectedNode(node)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs transition-colors ${
                          node.alerts.level === "warning"
                            ? "bg-cyan-700 hover:bg-cyan-800 text-white"
                            : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                        type="button"
                      >
                        Details
                      </button>
                      <button
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Options"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNodes.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-sm">
                    No nodes match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD LIST (below md) */}
        <div className="md:hidden flex flex-col divide-y divide-slate-200">
          {filteredNodes.map((node) => (
            <div key={node.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${
                      node.status === "online" ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  ></div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{node.name}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {node.location}
                      </span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px] mt-0.5">{node.topic}</div>
                  </div>
                </div>
                <StatusBadge status={node.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Temp</span>
                  <TempCell node={node} />
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Humidity</span>
                  <HumidityCell node={node} />
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pressure</span>
                  <PressureCell node={node} />
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Battery</span>
                  <BatteryBar power={node.power} />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <AlertBadge alerts={node.alerts} />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedNode(node)}
                    className="px-3 py-1.5 rounded-md bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold shadow-xs transition-colors"
                    type="button"
                  >
                    Details
                  </button>
                  <button
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                    title="Options"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredNodes.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No nodes match your search or filter.
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">wifi_tethering</span>
            <span>
              Showing <strong>{filteredNodes.length} of {NODES.length} Active Stations</strong> across
              backyard &amp; roof mesh
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>Auto-refreshing via MQTT broker every 30 seconds</span>
          </div>
        </div>
      </div>

      {/* THRESHOLD RULES */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-700 text-[20px]">tune</span>
            <h3 className="text-sm font-bold text-slate-900">
              Active MQTT Threshold Rules Across Mesh
            </h3>
          </div>
          <span className="text-xs font-semibold text-cyan-700">3 Active Protections</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RULES.map((rule) => (
            <div
              key={rule.title}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between gap-3 hover:border-cyan-600/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{rule.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{rule.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input defaultChecked={rule.enabled} className="sr-only peer" type="checkbox" />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-700"></div>
                </label>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {rule.affectedLabel} <strong className="text-amber-700">{rule.affectedNodes}</strong>
                </span>
                <span className={`font-bold text-[11px] ${RuleTagColor(rule.tagColor)}`}>
                  {rule.tagLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NODE DETAIL MODAL (placeholder – replace with your dedicated overlay when ready) */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-start sm:items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">sensors</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedNode.name}: {selectedNode.location} Station
                    </h3>
                    <StatusBadge status={selectedNode.status} />
                    {selectedNode.alerts.count > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold">
                        {selectedNode.alerts.count} Warnings
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    MQTT Topic:{" "}
                    <code className="font-mono text-cyan-800 bg-cyan-50 px-1 py-0.5 rounded text-[11px]">
                      {selectedNode.topic}
                    </code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0"
                title="Close Inspection"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex flex-col gap-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Temperature
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 block my-1">
                    {selectedNode.tempC.toFixed(1)}°C
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check</span> Steady
                  </span>
                </div>
                <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Humidity
                  </span>
                  <span className="text-xl font-extrabold text-teal-700 block my-1">
                    {selectedNode.humidity.toFixed(1)}%
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">warning</span> Above 75% Trigger
                  </span>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Air Pressure
                  </span>
                  <span className="text-xl font-extrabold text-amber-700 block my-1">
                    {selectedNode.pressureHpa.toLocaleString(undefined, { minimumFractionDigits: 1 })}{" "}
                    <span className="text-xs text-slate-500 font-normal">hPa</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">trending_down</span> Falling Fast
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Battery Level
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 block my-1">
                    {selectedNode.power.level}%
                  </span>
                  <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-emerald-600">
                      check_circle
                    </span>
                    3.98V (~3 wks)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Pressure &amp; Humidity Trend (Last 2 Hours)
                  </span>
                  <div className="flex items-center gap-3 text-[11px] flex-wrap">
                    <span className="inline-flex items-center gap-1 text-cyan-800 font-medium">
                      <span className="w-2 h-0.5 bg-cyan-600"></span> Air Pressure
                    </span>
                    <span className="inline-flex items-center gap-1 text-teal-700 font-medium">
                      <span className="w-2 h-0.5 bg-teal-500"></span> Humidity
                    </span>
                  </div>
                </div>
                <div className="relative h-32 w-full bg-slate-50 rounded-lg border border-slate-200 p-2">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                    <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="400" y1="25" y2="25" />
                    <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="400" y1="50" y2="50" />
                    <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="400" y1="75" y2="75" />
                    <line
                      stroke="#d97706"
                      strokeDasharray="4 4"
                      strokeWidth="1.5"
                      x1="0"
                      x2="400"
                      y1="50"
                      y2="50"
                    />
                    <path d="M 0 30 Q 150 40 400 80" fill="none" stroke="#00647c" strokeWidth="2.5" />
                    <path
                      d="M 0 75 Q 200 65 400 25"
                      fill="none"
                      stroke="#00687a"
                      strokeDasharray="3 3"
                      strokeWidth="2"
                    />
                    <circle cx="400" cy="80" fill="#00647c" r="4" />
                    <circle cx="400" cy="25" fill="#00687a" r="4" />
                  </svg>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>2 Hours Ago</span>
                    <span>1 Hour Ago</span>
                    <span>30 Mins Ago</span>
                    <span className="font-bold text-slate-700">Now</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-slate-900">
                  Station Alert Thresholds for {selectedNode.name}
                </span>
                <div className="flex flex-col gap-2">
                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Rapid Pressure Drop</span>
                      <span className="text-slate-600 text-[11px]">
                        Triggers when falling faster than 1.5 hPa in 3 hrs
                      </span>
                    </div>
                    <input defaultChecked className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 shrink-0" type="checkbox" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200 flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">High Air Humidity Warning</span>
                      <span className="text-slate-600 text-[11px]">Triggers when humidity exceeds 75%</span>
                    </div>
                    <input defaultChecked className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 shrink-0" type="checkbox" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Low Battery Alert</span>
                      <span className="text-slate-600 text-[11px]">Triggers when voltage drops below 20%</span>
                    </div>
                    <input defaultChecked className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 shrink-0" type="checkbox" />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Ping</span>
                  <strong className="text-slate-800 text-sm">{selectedNode.latencyMs} ms</strong>
                </div>
                <div className="p-1 border-x border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Last Sync</span>
                  <strong className="text-slate-800 text-sm">{selectedNode.lastSeen}</strong>
                </div>
                <div className="p-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Battery</span>
                  <strong className="text-slate-800 text-sm">3.98 V</strong>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <button
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-600">tune</span>
                <span>Recalibrate Node</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex-1"
                  type="button"
                >
                  Close
                </button>
                <button
                  className="h-9 px-4 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold transition-colors shadow-xs flex-1"
                  type="button"
                >
                  Save Thresholds
                </button>
              </div>
            </div>
          </div>
        </div>

      )}
    </div>

  );
}
