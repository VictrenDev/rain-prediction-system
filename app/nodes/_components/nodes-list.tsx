"use client";

import clsx from "clsx";
import type { NodeView } from "@/lib/nodes-data";

type NodesListProps = {
  nodes: NodeView[];
};

function ago(iso: string | null) {
  if (!iso) return "Never";
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

export default function NodesList({ nodes }: NodesListProps) {
  return (
    <>
      {/* DESKTOP TABLE (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold select-none">
            <tr>
              <th className="py-3.5 px-4">Node &amp; Location</th>
              <th className="py-3.5 px-4">Connection</th>
              <th className="py-3.5 px-4">Temperature</th>
              <th className="py-3.5 px-4">Humidity</th>
              <th className="py-3.5 px-4">Air Pressure</th>
              <th className="py-3.5 px-4">Rain Sensor</th>
              <th className="py-3.5 px-4">Last Seen</th>
              <th className="py-3.5 px-4">Alerts / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {nodes.map((node) => (
              <tr
                key={node.id}
                className={`transition-colors group ${node.alerts.level === "warning" ? "bg-cyan-50/20 hover:bg-cyan-50/40" : "hover:bg-slate-50/80"}`}
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 relative ${node.status === "online" ? "bg-emerald-500" : "bg-slate-300"}`}>
                      {node.status === "online" && node.alerts.level === "warning" && (
                        <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{node.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">{node.location}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex justify-center items-center gap-1.5">
                    <StatusBadge status={node.status} />
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
                  <RainCell node={node} />
                </td>
                <td className="py-3.5 px-4">
                  <LastSeenCell node={node} />
                </td>
                <td className="py-3.5 px-4">
                  <AlertBadge prediction={node.prediction} />
                </td>
              </tr>
            ))}
            {nodes.length === 0 && (
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
        {nodes.map((node) => (
          <div key={node.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${node.status === "online" ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{node.name}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">{node.location}</span>
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
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Rain Sensor</span>
                <RainCell node={node} />
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Last Seen</span>
                <LastSeenCell node={node} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <AlertBadge prediction={node.prediction} />
            </div>
          </div>
        ))}
        {nodes.length === 0 && <div className="py-8 text-center text-slate-400 text-sm">No nodes match your search or filter.</div>}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: NodeView["status"] }) {
  if (status === "online") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Online
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

function AlertBadge({ prediction }: { prediction: NodeView["prediction"] }) {
  if (prediction === "raining" || prediction === "rain-likely") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
        {prediction === "raining" ? "Raining" : "Rain Likely"}
      </span>
    );
  }
  if (prediction === "no-data") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold whitespace-nowrap">
        <span className="material-symbols-outlined text-[14px]">help</span>
        No data
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold whitespace-nowrap">
      <span className="material-symbols-outlined text-[14px]">check_circle</span>
      Clear
    </span>
  );
}

function TempCell({ node }: { node: NodeView }) {
  const t = node.latest?.temp;
  if (t == null) return <span className="text-slate-400">—</span>;
  return (
    <span className={clsx("text-sm font-bold", t < 20 ? "text-sky-600" : t < 30 ? "text-amber-600" : "text-rose-600")}>
      {t.toFixed(1)}°C
    </span>
  );
}

function HumidityCell({ node }: { node: NodeView }) {
  const h = node.latest?.humidity;
  if (h == null) return <span className="text-slate-400">—</span>;
  const cls = clsx("text-sm font-bold", {
    "text-amber-600": h < 50,
    "text-emerald-600": h >= 50 && h < 70,
    "text-yellow-600": h >= 70 && h < 80,
    "text-orange-600": h >= 80 && h < 90,
    "text-red-600": h >= 90,
  });
  return <span className={cls}>{h.toFixed(1)}%</span>;
}

function PressureCell({ node }: { node: NodeView }) {
  const p = node.latest?.pressure;
  if (p == null) return <span className="text-slate-400">—</span>;
  const d = node.pressureDelta;
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-sm font-bold text-slate-700">
        {p.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}{" "}
        <span className="text-xs font-normal text-slate-500">hPa</span>
      </span>
      {d !== null && (
        <span className={clsx("text-[10px] font-medium", d <= -0.5 ? "text-amber-600" : "text-slate-400")}>
          {d > 0 ? "+" : ""}
          {d.toFixed(2)} hPa / 3h
        </span>
      )}
    </div>
  );
}

function RainCell({ node }: { node: NodeView }) {
  if (!node.latest) return <span className="text-slate-400">—</span>;
  const wet = node.latest.isRaining;
  return (
    <div className="flex items-center gap-2">
      <span className={clsx("material-symbols-outlined text-[18px]", wet ? "text-cyan-600" : "text-slate-300")}>
        {wet ? "water_drop" : "sunny"}
      </span>
      <div className="flex flex-col leading-tight">
        <span className={clsx("text-sm font-bold", wet ? "text-cyan-700" : "text-slate-600")}>{wet ? "Wet" : "Dry"}</span>
        {node.latest.rainRaw != null && <span className="text-[10px] text-slate-400">raw {node.latest.rainRaw}</span>}
      </div>
    </div>
  );
}

function LastSeenCell({ node }: { node: NodeView }) {
  return (
    <span className={clsx("text-xs font-medium", node.status === "online" ? "text-slate-600" : "text-slate-400")}>
      {ago(node.lastSeen)}
    </span>
  );
}
