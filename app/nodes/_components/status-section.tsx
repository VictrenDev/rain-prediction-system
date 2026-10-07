"use client";

import StatCard from "./stats-card";
import { useNodesData } from "@/hooks/use-nodes-data";

function ago(iso: string | null) {
  if (!iso) return "never";
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  return `${Math.round(s / 3600)}h ago`;
}

const f = (n: number | null | undefined, d = 1) => (n === null || n === undefined ? "—" : n.toFixed(d));

export default function StatusSection() {
  const { data, error, isLoading } = useNodesData();
  const s = data?.stats;
  const th = data?.thresholds;
  const nodes = data?.nodes ?? [];

  const pct = s && s.total > 0 ? Math.round((s.online / s.total) * 100) : 0;
  const allOnline = !!s && s.total > 0 && s.offline === 0;
  const firstOffline = nodes.find((n) => n.status === "offline");

  const delta = s?.pressureDelta ?? null;
  const windowH = s ? Math.round(s.trendWindowMin / 60) : 3;
  const trendLabel =
    delta === null ? "Not enough data" : delta <= -1.5 ? "Falling fast" : delta < -0.5 ? "Falling" : delta > 0.5 ? "Rising" : "Steady";
  const trendColor = delta !== null && delta < -0.5 ? "text-amber-700" : "text-slate-800";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* 1. NODE STATUS */}
      <StatCard
        icon="hub"
        title="Total Sensor Nodes"
        badge={
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap ${
              allOnline ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${allOnline ? "bg-emerald-500" : "bg-amber-500"}`} />
            {isLoading ? "Loading" : `${pct}% Online`}
          </span>
        }
        value={
          <>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{s ? `${s.online} Online` : "—"}</span>
            <span className="text-sm font-medium text-slate-500">/ {s?.offline ?? "—"} Offline</span>
          </>
        }
        description={
          error ? (
            <>
              <span className="material-symbols-outlined text-[16px] text-red-600">error</span>
              Couldn&apos;t reach the database
            </>
          ) : allOnline ? (
            <>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              All nodes transmitting normally via MQTT
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px] text-amber-600">warning</span>
              {s?.offline ?? 0} node(s) not reporting
            </>
          )
        }
        footer={
          firstOffline ? (
            <span>
              Last seen:{" "}
              <strong className="text-amber-700 font-semibold">
                {firstOffline.name} ({ago(firstOffline.lastSeen)})
              </strong>
            </span>
          ) : (
            <span>
              Last reading: <strong className="text-slate-800">{ago(s?.lastReadingAt ?? null)}</strong>
            </span>
          )
        }
      />

      {/* 2. RAIN DETECTION (replaces Mesh Signal Quality) */}
      <StatCard
        icon="water_drop"
        title="Rain Detection"
        badge={
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap ${
              s?.raining
                ? "bg-cyan-50 border-cyan-200 text-cyan-800"
                : s?.rainExpected
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            {s?.raining ? "Raining" : s?.rainExpected ? "Rain Likely" : "Clear"}
          </span>
        }
        value={
          <>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{s ? `${s.raining} Wet` : "—"}</span>
            <span className="text-sm font-medium text-slate-500">/ {s?.online ?? "—"} reporting</span>
          </>
        }
        description={
          <>
            <span className="material-symbols-outlined text-[16px] text-cyan-700">umbrella</span>
            {s?.predicting ?? 0} node(s) predicting rain
            {th?.multiNodeCheck ? ` (need ${th.minNodesAgree})` : ""}
          </>
        }
        footer={
          <span>
            Humidity avg: <strong className="text-slate-800">{f(s?.avgHumidity)}%</strong>
            {th ? <span className="text-slate-400"> · trigger ≥ {th.humidityPct}%</span> : null}
          </span>
        }
      />

      {/* 3. NETWORK CONDITIONS (replaces Power Source Mix) */}
      <StatCard
        icon="speed"
        iconClassName="text-teal-600"
        title="Network Conditions"
        badge={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold whitespace-nowrap">
            Pressure {trendLabel}
          </span>
        }
        value={
          <>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{f(s?.avgPressure)}</span>
            <span className="text-sm font-medium text-slate-500">hPa avg</span>
          </>
        }
        description={
          <>
            <span className="material-symbols-outlined text-[16px] text-teal-600">thermostat</span>
            Avg temperature {f(s?.avgTemp)}°C
          </>
        }
        footer={
          <span>
            {windowH}h change:{" "}
            <strong className={`${trendColor} font-semibold`}>
              {delta === null ? "—" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)} hPa`}
            </strong>
            {th ? <span className="text-slate-400"> · trigger −{th.pressureDropHpa}</span> : null}
          </span>
        }
      />

      {/* 4. MQTT DATA FREQUENCY (now measured) */}
      <StatCard
        icon="sync"
        title="MQTT Data Frequency"
        badge={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-bold whitespace-nowrap">
            Live
          </span>
        }
        value={
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {s?.avgIntervalSec ? `Every ${s.avgIntervalSec}s` : "—"}
          </span>
        }
        description={
          <>
            <span className="material-symbols-outlined text-[16px] text-cyan-700">cloud_sync</span>
            Per-node average over the last hour
          </>
        }
        footer={
          <span>
            Readings (1h): <strong className="text-slate-800">{s?.readingsLastHour ?? "—"}</strong>
          </span>
        }
      />
    </div>
  );
}
