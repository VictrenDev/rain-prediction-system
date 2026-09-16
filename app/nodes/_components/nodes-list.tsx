"use client";

import { SENSOR_NODES_LIST } from "@/lib/global-variables";
import { NodeStatus, SensorNode } from "@/lib/types/nodes";
import clsx from "clsx";
import { useState } from "react";


type NodeListProps = {
  search: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<"all" | "healthy" | "warnings" | "offline">>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};


export default function NodesList({ search, filter, setFilter, setSearch }: NodeListProps) {
  const [selectedNode, setSelectedNode] = useState<SensorNode | null>(null);

  const filteredNodes = SENSOR_NODES_LIST.filter((n) => {
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
    all: SENSOR_NODES_LIST.length,
    healthy: SENSOR_NODES_LIST.filter((n) => n.alerts.level === "normal").length,
    warnings: SENSOR_NODES_LIST.filter((n) => n.alerts.level === "warning").length,
    offline: SENSOR_NODES_LIST.filter((n) => n.status === "offline").length,
  };

  return (
    <>
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

            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {filteredNodes.map((node) => (
              <tr key={node.id} className={`transition-colors group ${node.alerts.level === "warning" ? "bg-cyan-50/20 hover:bg-cyan-50/40" : "hover:bg-slate-50/80"}`}>
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
                      {/*<div className="text-slate-400 font-mono text-[11px] mt-0.5">{node.topic}</div>*/}
                      </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">{node.location}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-center items-center gap-1.5">
                      <StatusBadge status={node.status} />
                    </div>
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
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Battery</span>
                <BatteryBar power={node.power} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <AlertBadge alerts={node.alerts} />
            </div>
          </div>
        ))}
        {filteredNodes.length === 0 && <div className="py-8 text-center text-slate-400 text-sm">No nodes match your search or filter.</div>}
      </div>
    </>
  );
}



function StatusBadge({ status }: { status: NodeStatus }) {
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
          <span className="material-symbols-outlined text-[14px] text-teal-600">{power.type === "AC Mains" ? "power" : "battery_5_bar"}</span>
          {power.type}
        </span>
        <span className={`font-bold ${power.level >= 60 ? "text-emerald-600" : power.level >= 30 ? "text-amber-700" : "text-rose-600"}`}>{power.level}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${power.level}%` }} />
      </div>
    </div>
  );
}

function TempCell({ node }: { node: SensorNode }) {
  const tempStatus:number = Number(node.tempC.toFixed(1))
  return (
    <div className="flex items-center gap-1.5">
      <span className={clsx("text-sm font-bold", tempStatus < 20 ? "text-sky-600" : tempStatus < 30 ? "text-amber-600" : "text-rose-600")}>{node.tempC.toFixed(1)}°C</span>
      <span className="inline-flex items-center text-emerald-600 text-[11px] font-medium whitespace-nowrap">
      </span>
    </div>
  );
}

function HumidityCell({ node }: { node: SensorNode }) {
  const humidityClass = clsx(
     "text-sm font-bold",
     {
       "text-amber-600": node.humidity < 50,
       "text-emerald-600": node.humidity >= 50 && node.humidity < 70,
       "text-yellow-600": node.humidity >= 70 && node.humidity < 80,
       "text-orange-600": node.humidity >= 80 && node.humidity < 90,
       "text-red-600": node.humidity >= 90,
     }
   );
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={`text-sm font-bold ${humidityClass}`}>{node.humidity.toFixed(1)}%</span>

    </div>
  );
}

function PressureCell({ node }: { node: SensorNode }) {
  return (
    <div className="flex flex-col">
      <span className={`text-sm font-bold text-slate-700`}>
        {node.pressureHpa.toLocaleString(undefined, { minimumFractionDigits: 1 })} <span className="text-xs font-normal text-slate-500">hPa</span>
      </span>

    </div>
  );
}
