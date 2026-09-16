"use client";

import clsx from "clsx";
import { useState } from "react";
import AddNodeButton from "./add-node-component";
import NodesList from "./nodes-list";
import { SENSOR_NODES_LIST } from "@/lib/global-variables";

export default function NodesTable() {
  const [filter, setFilter] = useState<"all" | "healthy" | "warnings" | "offline">("all");
  const [search, setSearch] = useState("");
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-65">
          {/* INPUT SEARCH BOX */}
          <div className="relative flex-1 max-w-md min-w-50">
            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-[18px]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
              placeholder="Search nodes by name, location, or MQTT topic..."
              type="text"
            />
          </div>
          {/* INPUT FILTER BUTTONS */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs overflow-x-auto">
            <button
              onClick={() => setFilter("all")}
              className={clsx(
                "px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap",
                filter === "all" ? "bg-white text-cyan-800 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900 font-medium",
              )}
            >
              All Nodes <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px]">{counts.all}</span>
            </button>

            <button
              onClick={() => setFilter("healthy")}
              className={clsx(
                "px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap",
                filter === "healthy" ? "bg-white text-cyan-800 font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 font-medium",
              )}
            >
              Healthy <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">{counts.healthy}</span>
            </button>

            <button
              onClick={() => setFilter("warnings")}
              className={clsx(
                "px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap",
                filter === "warnings" ? "bg-white text-amber-800 font-bold shadow-xs" : "text-amber-700 hover:text-amber-800 font-medium",
              )}
            >
              Warnings <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">{counts.warnings}</span>
            </button>

            <button
              onClick={() => setFilter("offline")}
              className={clsx(
                "px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap",
                filter === "offline" ? "bg-white text-slate-800 font-bold shadow-xs" : "text-slate-400 font-medium",
              )}
            >
              Offline <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-500 text-[10px]">{counts.offline}</span>
            </button>
          </div>
        </div>
        {/* QUICK ACTIONS */}
        <div className="flex items-center gap-2.5">
          {/* EXPORT AS CSV */}
          <button
            className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export CSV</span>
          </button>
          {/* ADD NEW NODE */}
          <AddNodeButton />
        </div>
      </div>

      <NodesList search={search} filter={filter} setFilter={setFilter} setSearch={setSearch} />

      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-emerald-600">wifi_tethering</span>
          <span>
            Showing{" "}
            <strong>
              {filteredNodes.length} of {SENSOR_NODES_LIST.length} Active Stations
            </strong>{" "}
            across backyard &amp; roof mesh
          </span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span>Auto-refreshing via MQTT broker every 30 seconds</span>
        </div>
      </div>
    </div>
  );
}
