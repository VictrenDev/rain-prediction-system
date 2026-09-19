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

      {/* REPLACED: Station Battery Health -> Mesh Signal Quality */}
      <StatCard
        icon="signal_cellular_alt"
        iconClassName="text-cyan-700"
        title="Mesh Signal Quality"
        badge={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold whitespace-nowrap">
            Strong
          </span>
        }
        value={
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">-64 dBm avg</span>
        }
        description={
          <>
            <span className="material-symbols-outlined text-[16px] text-emerald-600">wifi</span>
            All 3 nodes within reliable range
          </>
        }
        footer={
          <span>
            Weakest link: <strong className="text-amber-700 font-semibold">South Valley (-84 dBm)</strong>
          </span>
        }
      />

      {/* REPLACED: Active Node Alerts -> Power Source Mix */}
      <StatCard
        icon="bolt"
        iconClassName="text-teal-600"
        title="Power Source Mix"
        badge={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold whitespace-nowrap">
            Mixed Supply
          </span>
        }
        value={
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">1 AC / 2 LiPo</span>
        }
        description={
          <>
            <span className="material-symbols-outlined text-[16px] text-teal-600">power</span>
            Master Hub on mains, field nodes on battery
          </>
        }
        footer={
          <span>
            Lowest battery: <strong className="text-amber-700 font-semibold">South Valley (48%)</strong>
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
