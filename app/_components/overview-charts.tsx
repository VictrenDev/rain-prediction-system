"use client";

import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

type MiniPoint = {
  time: string;
  value: number;
};

type MiniTrendChartProps = {
  data: MiniPoint[];
  color: string;
  gradientId: string;
  unit: string;
  domain: [number, number];
  thresholdValue?: number;
  thresholdLabel?: string;
};

function MiniTooltip({ active, payload, label, unit, color }: { active?: boolean; payload?: any[]; label?: string; unit: string; color: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-2.5 py-1.5 text-[11px]">
      <p className="font-semibold text-slate-500">{label}</p>
      <p className="font-bold" style={{ color }}>
        {payload[0].value?.toFixed(1)}
        {unit}
      </p>
    </div>
  );
}

function MiniTrendChart({ data, color, gradientId, unit, domain, thresholdValue, thresholdLabel }: MiniTrendChartProps) {
  const last = data[data.length - 1];

  return (
    <div className="w-full h-28 relative">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 15, right: 50, left: 5, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 500 }} axisLine={{ stroke: "#f1f5f9" }} tickLine={false} interval="preserveStartEnd" />

          <YAxis domain={domain} tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={38} />

          <Tooltip content={<MiniTooltip unit={unit} color={color} />} />

          {thresholdValue !== undefined && (
            <ReferenceLine
              y={thresholdValue}
              stroke={color}
              strokeDasharray="4 3"
              strokeWidth={1.5}
              strokeOpacity={0.85}
              label={{
                value: thresholdLabel,
                position: "insideTopLeft",
                fill: color,
                fontSize: 9,
                fontWeight: 700,
              }}
            />
          )}

          <Area type="monotone" dataKey="value" stroke="none" fill={`url(#${gradientId})`} />

          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: color, stroke: "#ffffff", strokeWidth: 1.5 }} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Current value + NOW marker, overlaid top-right like the original */}
      {last && (
        <div className="absolute top-2.5 right-1 flex flex-col items-end gap-0.5 pointer-events-none">
          <span className="text-[9px] font-bold" style={{ color }}>
            {last.value.toFixed(1)}
            {unit}
          </span>
          <span className="text-[9px] font-bold" style={{ color }}>
            NOW
          </span>
        </div>
      )}
    </div>
  );
}

// ---- Mock data — replace each with a real fetch/series from your pipeline ----

const PRESSURE_DATA: MiniPoint[] = [
  { time: "2:00 PM", value: 1013.8 },
  { time: "2:15 PM", value: 1013.1 },
  { time: "2:30 PM", value: 1012.0 },
  { time: "2:45 PM", value: 1011.0 },
  { time: "3:00 PM", value: 1010.2 },
  { time: "3:15 PM", value: 1009.6 },
  { time: "3:30 PM", value: 1009.1 },
  { time: "3:45 PM", value: 1008.8 },
  { time: "4:00 PM", value: 1008.5 },
  { time: "4:15 PM", value: 1008.4 },
];

const HUMIDITY_DATA: MiniPoint[] = [
  { time: "2:00 PM", value: 61 },
  { time: "2:15 PM", value: 63 },
  { time: "2:30 PM", value: 67 },
  { time: "2:45 PM", value: 70 },
  { time: "3:00 PM", value: 74 },
  { time: "3:15 PM", value: 77 },
  { time: "3:30 PM", value: 79 },
  { time: "3:45 PM", value: 81 },
  { time: "4:00 PM", value: 83 },
  { time: "4:15 PM", value: 84.2 },
];

const TEMPERATURE_DATA: MiniPoint[] = [
  { time: "2:00 PM", value: 22.9 },
  { time: "2:15 PM", value: 22.7 },
  { time: "2:30 PM", value: 22.4 },
  { time: "2:45 PM", value: 22.1 },
  { time: "3:00 PM", value: 21.9 },
  { time: "3:15 PM", value: 21.7 },
  { time: "3:30 PM", value: 21.6 },
  { time: "3:45 PM", value: 21.5 },
  { time: "4:00 PM", value: 21.4 },
  { time: "4:15 PM", value: 21.4 },
];

export function PressureChart() {
  return (
    <MiniTrendChart data={PRESSURE_DATA} color="#0891b2" gradientId="pressureGradient" unit=" hPa" domain={[1007, 1015]} thresholdValue={1010} thresholdLabel="Alert 1,010 hPa" />
  );
}

export function HumidityChart() {
  return <MiniTrendChart data={HUMIDITY_DATA} color="#0d9488" gradientId="humidityGradient" unit="%" domain={[55, 95]} thresholdValue={75} thresholdLabel="Moisture alert 75%" />;
}

export function TemperatureChart() {
  return <MiniTrendChart data={TEMPERATURE_DATA} color="#d97706" gradientId="temperatureGradient" unit="°C" domain={[20, 24]} />;
}
