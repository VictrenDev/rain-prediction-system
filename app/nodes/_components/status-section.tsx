"use client";

import StatCard from "./stats-card";

export default function StatusSection() {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatCard icon="hub" title="Total Sensor Nodes"
        badge={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            100% Online
          </span>
        }
        value={
          <>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">3 Online</span>
            <span className="text-sm font-medium text-slate-500">/ 0 Offline</span>
          </>
        }
        description={<>
            <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            All nodes transmitting normally via MQTT
          </>
        }
        footer={
          <span>
            Data transmission: <strong className="text-slate-800">Zero packets lost</strong>
          </span>
        }
      />
      <StatCard
        icon="battery_charging_full"
        iconClassName="text-teal-600"
        title="Station Battery Health"
        badge={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold whitespace-nowrap">
            Healthy
          </span>
        }
        value={<span className="text-3xl font-extrabold text-slate-900 tracking-tight">Good (76%)</span>}
        description={
          <>
            <span className="material-symbols-outlined text-[16px] text-teal-600">power</span>1 on AC Mains, 2 on LiPo Battery
          </>
        }
        footer={
          <span>
            Lowest node: <strong className="text-amber-700 font-semibold">South Valley (48%)</strong>
          </span>
        }
      />
      <StatCard
        icon="warning"
        iconClassName="text-amber-600"
        title="Active Node Alerts"
        hoverClassName="hover:border-amber-400"
        badge={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            Attention
          </span>
        }
        value={<span className="text-3xl font-extrabold text-amber-700 tracking-tight">2 Warnings</span>}
        description={
          <>
            <span className="material-symbols-outlined text-[16px]">trending_down</span>
            Rapid pressure drop on North Garden
          </>
        }
        footer={
          <span>
            Secondary alert: <strong className="text-amber-700 font-semibold">High humidity (88%)</strong>
          </span>
        }
      />
      <StatCard
        icon="sync"
        title="MQTT Data Frequency"
        badge={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-bold whitespace-nowrap">
            Real-time
          </span>
        }
        value={
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Every 30s
          </span>
        }
        description={
          <>
            <span className="material-symbols-outlined text-[16px] text-cyan-700">
              cloud_sync
            </span>
            Automatic background sync active
          </>
        }
        footer={
          <span>
            Broker latency:{" "}
            <strong className="text-slate-800">14 ms average</strong>
          </span>
        }
      />
    </div>
  );
}
