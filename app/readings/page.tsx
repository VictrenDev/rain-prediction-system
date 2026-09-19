"use client";

import { useState } from "react";

type Reading = {
  timestamp: string;
  nodeId: string;
  nodeName: string;
  temperature: number;
  humidity: number;
  pressure: number;
  rain: "Dry" | "Detected";
};

const NODE_NAMES = ["All Nodes", "Master Hub", "Node 1 (North Garden)", "Node 2 (South Valley)"];

const READINGS: Reading[] = [
  { timestamp: "2026-09-18 17:00", nodeId: "hub-00", nodeName: "Master Hub", temperature: 22.4, humidity: 54, pressure: 1014.8, rain: "Dry" },
  { timestamp: "2026-09-18 17:00", nodeId: "node-01", nodeName: "Node 1 (North Garden)", temperature: 19.8, humidity: 68, pressure: 1001.2, rain: "Dry" },
  { timestamp: "2026-09-18 17:00", nodeId: "node-02", nodeName: "Node 2 (South Valley)", temperature: 23.1, humidity: 79, pressure: 1026.5, rain: "Detected" },
  { timestamp: "2026-09-18 16:30", nodeId: "hub-00", nodeName: "Master Hub", temperature: 22.2, humidity: 55, pressure: 1015.0, rain: "Dry" },
  { timestamp: "2026-09-18 16:30", nodeId: "node-01", nodeName: "Node 1 (North Garden)", temperature: 20.1, humidity: 65, pressure: 1002.6, rain: "Dry" },
  { timestamp: "2026-09-18 16:30", nodeId: "node-02", nodeName: "Node 2 (South Valley)", temperature: 22.6, humidity: 74, pressure: 1026.1, rain: "Dry" },
  { timestamp: "2026-09-18 16:00", nodeId: "hub-00", nodeName: "Master Hub", temperature: 21.9, humidity: 56, pressure: 1015.3, rain: "Dry" },
  { timestamp: "2026-09-18 16:00", nodeId: "node-01", nodeName: "Node 1 (North Garden)", temperature: 20.4, humidity: 61, pressure: 1004.0, rain: "Dry" },
  { timestamp: "2026-09-18 16:00", nodeId: "node-02", nodeName: "Node 2 (South Valley)", temperature: 22.1, humidity: 70, pressure: 1025.8, rain: "Dry" },
  { timestamp: "2026-09-18 15:30", nodeId: "hub-00", nodeName: "Master Hub", temperature: 21.6, humidity: 57, pressure: 1015.5, rain: "Dry" },
  { timestamp: "2026-09-18 15:30", nodeId: "node-01", nodeName: "Node 1 (North Garden)", temperature: 20.6, humidity: 59, pressure: 1005.4, rain: "Dry" },
  { timestamp: "2026-09-18 15:30", nodeId: "node-02", nodeName: "Node 2 (South Valley)", temperature: 21.8, humidity: 66, pressure: 1025.5, rain: "Dry" },
];

function RainBadge({ rain }: { rain: Reading["rain"] }) {
  if (rain === "Detected") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-[11px] font-semibold whitespace-nowrap">
        <span className="material-symbols-outlined text-[13px]">water_drop</span>
        Detected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold whitespace-nowrap">
      Dry
    </span>
  );
}

export default function ReadingsHistoryPage() {
  const [nodeFilter, setNodeFilter] = useState("All Nodes");
  const [range, setRange] = useState("24h");

  const filtered = READINGS.filter(
    (r) => nodeFilter === "All Nodes" || r.nodeName === nodeFilter
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-[1500px] mx-auto w-full text-slate-900">
      {/* PAGE INTRO */}
      <div>
        <h1 className="text-lg font-bold text-slate-900">Readings History</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Historical sensor readings logged from all mesh nodes.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {NODE_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => setNodeFilter(name)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                nodeFilter === name
                  ? "bg-cyan-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none focus:border-cyan-600"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <button
            type="button"
            className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* READINGS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold select-none">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Node</th>
                <th className="py-3 px-4">Temperature</th>
                <th className="py-3 px-4">Humidity</th>
                <th className="py-3 px-4">Pressure</th>
                <th className="py-3 px-4">Rain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {r.timestamp}
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.nodeName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {r.temperature.toFixed(1)}°C
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.humidity}%</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {r.pressure.toFixed(1)} hPa
                  </td>
                  <td className="py-3 px-4">
                    <RainBadge rain={r.rain} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                    No readings for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden flex flex-col divide-y divide-slate-200">
          {filtered.map((r, i) => (
            <div key={i} className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">{r.timestamp}</span>
                <RainBadge rain={r.rain} />
              </div>
              <span className="text-xs text-slate-500">{r.nodeName}</span>
              <div className="grid grid-cols-3 gap-2 mt-1 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Temp</span>
                  <span className="font-semibold text-slate-900">{r.temperature.toFixed(1)}°C</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Humidity</span>
                  <span className="font-semibold text-slate-900">{r.humidity}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Pressure</span>
                  <span className="font-semibold text-slate-900">{r.pressure.toFixed(1)} hPa</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No readings for this selection.
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-700">{filtered.length}</strong> readings
          </span>
          <span>Logged every 30 minutes</span>
        </div>
      </div>
    </div>
  );
}
