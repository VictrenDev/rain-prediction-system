"use client";

import { useMemo, useState } from "react";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

type MetricView = "both" | "humidity" | "pressure" | "temperature";
type TimeRange = "30m" | "1h" | "3h" | "6h" | "24h";

type TrendPoint = {
  time: string;
  humidity: number;
  pressure: number;
  temperature: number;
};

// Mock historical series — replace with a real fetch keyed by `range`
const FULL_SERIES: TrendPoint[] = [
  { time: "09:00 AM", humidity: 72.0, pressure: 1010.0, temperature: 21.1 },
  { time: "09:20 AM", humidity: 73.4, pressure: 1009.8, temperature: 21.2 },
  { time: "09:40 AM", humidity: 74.8, pressure: 1009.5, temperature: 21.2 },
  { time: "10:00 AM", humidity: 76.0, pressure: 1009.1, temperature: 21.3 },
  { time: "10:20 AM", humidity: 77.6, pressure: 1008.9, temperature: 21.3 },
  { time: "10:40 AM", humidity: 79.1, pressure: 1008.6, temperature: 21.4 },
  { time: "11:00 AM", humidity: 80.0, pressure: 1008.3, temperature: 21.4 },
  { time: "11:20 AM", humidity: 81.8, pressure: 1008.1, temperature: 21.4 },
  { time: "11:40 AM", humidity: 83.5, pressure: 1007.9, temperature: 21.4 },
  { time: "12:00 PM", humidity: 85.1, pressure: 1008.2, temperature: 21.4 },
];

const RANGE_POINT_COUNT: Record<TimeRange, number> = {
  "30m": 2,
  "1h": 3,
  "3h": 10,
  "6h": 10,
  "24h": 10,
};

const HUMIDITY_THRESHOLD = 75;

function CustomTooltip({ active, payload, label, view }: { active?: boolean; payload?: any[]; label?: string; view: MetricView }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-bold text-slate-800 mb-1">{label}</p>
      {(view === "both" || view === "humidity") && <p className="text-cyan-700 font-semibold">Humidity: {payload.find((p) => p.dataKey === "humidity")?.value?.toFixed(1)}%</p>}
      {(view === "both" || view === "pressure") && <p className="text-amber-700 font-semibold">Pressure: {payload.find((p) => p.dataKey === "pressure")?.value?.toFixed(1)} hPa</p>}
      {view === "temperature" && <p className="text-slate-700 font-semibold">Temp: {payload.find((p) => p.dataKey === "temperature")?.value?.toFixed(1)}°C</p>}
    </div>
  );
}

export default function RainPredictionPage() {
  const [view, setView] = useState<MetricView>("both");
  const [range, setRange] = useState<TimeRange>("3h");

  const data = useMemo(() => {
    const count = RANGE_POINT_COUNT[range];
    return FULL_SERIES.slice(-count);
  }, [range]);

  const first = data[0];
  const last = data[data.length - 1];

  const showHumidity = view === "both" || view === "humidity";
  const showPressure = view === "both" || view === "pressure";
  const showTemperature = view === "temperature";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-[1500px] mx-auto w-full text-slate-900">
      {/* SECTION 1: CURRENT PREDICTION */}
      <div className="bg-gradient-to-br from-cyan-900 via-cyan-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-cyan-700/50 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-cyan-500/10 pointer-events-none blur-2xl"></div>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col gap-2.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-xs font-semibold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[15px]">insights</span>
                  Current Prediction
                </span>
                <span className="text-cyan-200/70 text-xs">•</span>
                <span className="text-cyan-200/90 text-xs font-medium">Next 3 hours</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-4 mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
                    <span className="material-symbols-outlined text-[32px]">weather_mix</span>
                  </div>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">Rain Likely</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-400/20 border border-amber-300/40 text-amber-200 text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  78% confidence
                </div>
              </div>
              <p className="text-cyan-50 text-sm sm:text-base font-normal mt-1 leading-relaxed">
                Humidity is high and rising while air pressure is falling — both point toward rain within the next few hours.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 flex flex-col gap-2.5 shrink-0 min-w-[240px] w-full md:w-auto">
              <span className="text-[11px] uppercase tracking-wider text-cyan-200 font-bold">Model State</span>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-amber-400/20 border border-amber-300/30 text-white font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Rain Likely
                  </span>
                  <span className="text-[10px] text-amber-200 font-bold uppercase">Active</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/5 text-cyan-200/60">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400/50"></span>
                    Rain Unlikely
                  </span>
                  <span className="text-[10px] uppercase">Off</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/5 text-cyan-200/60">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400/50"></span>
                    Rain Detected
                  </span>
                  <span className="text-[10px] uppercase">Dry</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <span className="text-cyan-200/80 font-semibold uppercase tracking-wider text-[11px] shrink-0">Why:</span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1.5 text-cyan-50">
                <span className="material-symbols-outlined text-[16px] text-teal-300">check_circle</span>
                Humidity 85.1% (above 75% threshold)
              </span>
              <span className="inline-flex items-center gap-1.5 text-cyan-50">
                <span className="material-symbols-outlined text-[16px] text-teal-300">check_circle</span>
                Pressure fell 1.8 hPa in 3h
              </span>
              <span className="inline-flex items-center gap-1.5 text-cyan-200/60">
                <span className="material-symbols-outlined text-[16px]">remove</span>
                Temperature stable, no rain yet
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CURRENT ENVIRONMENTAL CONDITIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-cyan-600/40 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Temperature</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">device_thermostat</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">21.4 °C</span>
            <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Stable</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">±0.2°C variation over 3h</p>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-cyan-500 shadow-xs bg-gradient-to-b from-cyan-50/40 to-white transition-colors">
          <div className="flex items-center justify-between text-cyan-800">
            <span className="text-xs font-bold uppercase tracking-wider">Humidity</span>
            <span className="material-symbols-outlined text-[18px] text-cyan-700">humidity_percentage</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-cyan-900 tracking-tight">85.1 %</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> Increasing
            </span>
          </div>
          <p className="text-[11px] text-cyan-700 font-medium mt-1">Exceeds 75% trigger threshold</p>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-amber-400 shadow-xs bg-gradient-to-b from-amber-50/30 to-white transition-colors">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider">Air Pressure</span>
            <span className="material-symbols-outlined text-[18px] text-amber-600">compress</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-900 tracking-tight">
              1008.2 <span className="text-xs font-normal text-slate-500">hPa</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span> Falling
            </span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">−1.8 hPa drop over last 3 hours</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-cyan-600/40 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Rain Sensor</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">rainy</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-800 tracking-tight">No Rain</span>
            <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Dry Baseline</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Zero precipitation detected yet</p>
        </div>
      </div>

      {/* SECTION 3: ENVIRONMENTAL TRENDS — now a functional Recharts chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-700 text-[22px]">show_chart</span>
              <h2 className="text-base font-bold text-slate-900">Environmental Trends</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Humidity rising and pressure falling — the two signals behind the forecast</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Metric view tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs overflow-x-auto">
              {(
                [
                  { key: "both", label: "Humidity & Pressure" },
                  { key: "humidity", label: "Humidity Only" },
                  { key: "pressure", label: "Pressure Only" },
                  { key: "temperature", label: "Temperature" },
                ] as { key: MetricView; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setView(opt.key)}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                    view === opt.key ? "bg-white text-cyan-800 font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 font-medium"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Time range tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              {(["30m", "1h", "3h", "6h", "24h"] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${
                    range === r ? "bg-cyan-700 text-white font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 font-medium"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-50/80 rounded-xl border border-slate-200 p-4">
          {/* Legend / current values */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3 px-2">
            <div className="flex items-center gap-5 text-xs flex-wrap">
              {showHumidity && (
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-1 bg-cyan-600 rounded-full"></span>
                  <span className="font-bold text-slate-800">Humidity (%)</span>
                  <span className="text-cyan-700 font-semibold">
                    {first?.humidity.toFixed(1)}% → {last?.humidity.toFixed(1)}%
                  </span>
                </div>
              )}
              {showPressure && (
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-1 bg-amber-600 rounded-full"></span>
                  <span className="font-bold text-slate-800">Pressure (hPa)</span>
                  <span className="text-amber-700 font-semibold">
                    {first?.pressure.toFixed(1)} → {last?.pressure.toFixed(1)} hPa
                  </span>
                </div>
              )}
              {showTemperature && (
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-1 bg-slate-600 rounded-full"></span>
                  <span className="font-bold text-slate-800">Temperature (°C)</span>
                  <span className="text-slate-700 font-semibold">
                    {first?.temperature.toFixed(1)}°C → {last?.temperature.toFixed(1)}°C
                  </span>
                </div>
              )}
            </div>
            {showHumidity && (
              <div className="flex items-center gap-2 text-xs text-rose-700 font-medium">
                <span className="w-3 border-t-2 border-dashed border-rose-500"></span>
                <span>Rain Trigger Threshold (Humidity ≥ 75%)</span>
              </div>
            )}
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="humidityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />

                {/* Left axis: humidity % or temperature °C */}
                {(showHumidity || showTemperature) && (
                  <YAxis
                    yAxisId="left"
                    domain={showTemperature ? ["auto", "auto"] : [50, 100]}
                    tick={{ fontSize: 10, fill: showTemperature ? "#475569" : "#0e7490" }}
                    axisLine={false}
                    tickLine={false}
                    unit={showTemperature ? "°C" : "%"}
                    width={40}
                  />
                )}

                {/* Right axis: pressure hPa */}
                {showPressure && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 10, fill: "#b45309" }}
                    axisLine={false}
                    tickLine={false}
                    unit=" hPa"
                    width={60}
                  />
                )}

                <Tooltip content={<CustomTooltip view={view} />} />

                {showHumidity && (
                  <ReferenceLine
                    yAxisId="left"
                    y={HUMIDITY_THRESHOLD}
                    stroke="#f43f5e"
                    strokeDasharray="5 4"
                    strokeWidth={1.5}
                    label={{
                      value: "75% threshold",
                      position: "insideTopLeft",
                      fill: "#e11d48",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                )}

                {showHumidity && <Area yAxisId="left" type="monotone" dataKey="humidity" stroke="none" fill="url(#humidityFill)" />}

                {showHumidity && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="humidity"
                    stroke="#0891b2"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#ffffff", stroke: "#0891b2", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {showPressure && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="pressure"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#ffffff", stroke: "#d97706", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {showTemperature && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#334155"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#ffffff", stroke: "#334155", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 4: PREDICTION THRESHOLDS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-700 text-[22px]">tune</span>
            <h2 className="text-base font-bold text-slate-900">Prediction Thresholds</h2>
          </div>
          <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">Configurable</span>
        </div>
        <p className="text-xs text-slate-500 -mt-2">These values decide when the model calls a prediction "Rain Likely."</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-900" htmlFor="humidity-thresh">
              Humidity Threshold
            </label>
            <div className="flex items-center gap-2">
              <input
                className="w-24 h-9 px-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                id="humidity-thresh"
                type="number"
                defaultValue={75}
              />
              <span className="text-xs font-bold text-slate-600">% RH</span>
            </div>
            <p className="text-[11px] text-slate-500">Trigger when humidity is at or above this</p>
            <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 w-fit">Currently triggered (85.1%)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-900" htmlFor="pressure-thresh">
              Pressure Drop
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <input
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                  id="pressure-thresh"
                  step="0.1"
                  type="number"
                  defaultValue={1.5}
                />
                <span className="text-xs font-medium text-slate-600">hPa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">over</span>
                <input
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                  id="period-hours"
                  type="number"
                  defaultValue={3}
                />
                <span className="text-xs font-medium text-slate-600">hrs</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Trigger when pressure falls this much within the period</p>
            <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 w-fit">Currently triggered (−1.8 hPa)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-900" htmlFor="prediction-window">
              Forecast Window
            </label>
            <div className="flex items-center gap-2">
              <input
                className="w-24 h-9 px-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                id="prediction-window"
                type="number"
                defaultValue={3}
              />
              <span className="text-xs font-medium text-slate-600">hours ahead</span>
            </div>
            <p className="text-[11px] text-slate-500">How far forward the model projects the trend</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">Applies to all selected mesh stations</span>
          <button
            className="h-9 px-4 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Save Thresholds</span>
          </button>
        </div>
      </div>
    </div>
  );
}
