"use client";

import { useState } from "react";

type TimeRange = "3h" | "24h" | "7d";

type MetricCardProps = {
  icon: string;
  iconClassName: string;
  title: string;
  badge: string;
  badgeClassName: string;
  value: string;
  unit?: string;
  description: string;
  descriptionClassName: string;
  footer: React.ReactNode;
};

type TrendCardProps = {
  icon: string;
  iconClassName: string;
  title: string;
  badge: string;
  badgeClassName: string;
  subtitle: string;
  current: string;
  unit: string;
  change: string;
  changeClassName: string;
  chart: React.ReactNode;
};

type Node = {
  name: string;
  location: string;
  status: "Online" | "Online (Good Signal)";
  pressure: string;
  temperature: string;
  humidity: string;
  color: "primary" | "secondary";
};

const NODES: Node[] = [
  {
    name: "Master Hub",
    location: "Roof Station",
    status: "Online (Good Signal)",
    pressure: "1,008.4 hPa",
    temperature: "21.4°C",
    humidity: "84%",
    color: "primary",
  },
  {
    name: "Node 1",
    location: "North Garden",
    status: "Online",
    pressure: "1,008.2 hPa",
    temperature: "20.6°C",
    humidity: "85%",
    color: "secondary",
  },
  {
    name: "Node 2",
    location: "South Valley",
    status: "Online",
    pressure: "1,008.9 hPa",
    temperature: "19.8°C",
    humidity: "88%",
    color: "secondary",
  },
];

function MetricCard({
  icon,
  iconClassName,
  title,
  badge,
  badgeClassName,
  value,
  unit,
  description,
  descriptionClassName,
  footer,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-cyan-600/40 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`material-symbols-outlined text-[20px] ${iconClassName}`}
          >
            {icon}
          </span>

          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${badgeClassName}`}
        >
          {badge}
        </span>
      </div>

      <div className="my-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {value}
          </span>

          {unit && (
            <span className="text-sm font-medium text-slate-500">{unit}</span>
          )}
        </div>

        <p
          className={`text-xs font-medium mt-1 flex items-center gap-1 ${descriptionClassName}`}
        >
          {description}
        </p>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        {footer}
      </div>
    </div>
  );
}

function PressureChart() {
  return (
    <svg
      className="w-full h-28 overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 800 110"
    >
      <defs>
        <linearGradient
          id="pressureGradient"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#0891b2" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      <line
        stroke="#f1f5f9"
        strokeWidth="1"
        x1="45"
        x2="785"
        y1="20"
        y2="20"
      />
      <line
        stroke="#f1f5f9"
        strokeWidth="1"
        x1="45"
        x2="785"
        y1="55"
        y2="55"
      />
      <line
        stroke="#f1f5f9"
        strokeWidth="1"
        x1="45"
        x2="785"
        y1="88"
        y2="88"
      />

      <line
        opacity="0.9"
        stroke="#d97706"
        strokeDasharray="5,4"
        strokeWidth="1.5"
        x1="45"
        x2="785"
        y1="55"
        y2="55"
      />

      <rect
        fill="#fffbeb"
        height="16"
        rx="2"
        stroke="#fde68a"
        strokeWidth="0.8"
        width="145"
        x="48"
        y="47"
      />

      <text
        fill="#b45309"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        x="52"
        y="59"
      >
        ALERT LINE 1,010 hPa
      </text>

      <text
        fill="#64748b"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="600"
        x="10"
        y="23"
      >
        1,014
      </text>

      <text
        fill="#b45309"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        x="10"
        y="58"
      >
        1,010
      </text>

      <text
        fill="#0891b2"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        x="10"
        y="91"
      >
        1,008
      </text>

      <path
        d="M 45 22 C 200 28, 380 50, 560 76 C 660 84, 730 89, 785 91 L 785 102 L 45 102 Z"
        fill="url(#pressureGradient)"
      />

      <path
        d="M 45 22 C 200 28, 380 50, 560 76 C 660 84, 730 89, 785 91"
        fill="none"
        stroke="#0891b2"
        strokeLinecap="round"
        strokeWidth="2.5"
      />

      <line
        stroke="#0891b2"
        strokeDasharray="2,2"
        strokeWidth="1"
        x1="785"
        x2="785"
        y1="15"
        y2="95"
      />

      <circle
        cx="785"
        cy="91"
        fill="#0891b2"
        r="4"
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      <text
        fill="#0891b2"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        textAnchor="end"
        x="775"
        y="88"
      >
        1,008.4 hPa
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="45"
        y="108"
      >
        2:00 PM
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="225"
        y="108"
      >
        2:45 PM
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="410"
        y="108"
      >
        3:30 PM
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="595"
        y="108"
      >
        4:15 PM
      </text>

      <text
        fill="#0891b2"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        x="760"
        y="108"
      >
        NOW
      </text>
    </svg>
  );
}

function HumidityChart() {
  return (
    <svg
      className="w-full h-28 overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 800 110"
    >
      <defs>
        <linearGradient id="humidityGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      <line
        stroke="#f1f5f9"
        strokeWidth="1"
        x1="45"
        x2="785"
        y1="20"
        y2="20"
      />
      <line
        stroke="#f1f5f9"
        strokeWidth="1"
        x1="45"
        x2="785"
        y1="52"
        y2="52"
      />
      <line
        stroke="#f1f5f9"
        strokeWidth="1"
        x1="45"
        x2="785"
        y1="85"
        y2="85"
      />

      <line
        opacity="0.85"
        stroke="#0d9488"
        strokeDasharray="4,3"
        strokeWidth="1.5"
        x1="45"
        x2="785"
        y1="52"
        y2="52"
      />

      <rect
        fill="#ccfbf1"
        height="16"
        rx="2"
        stroke="#99f6e4"
        strokeWidth="0.8"
        width="138"
        x="48"
        y="44"
      />

      <text
        fill="#0f766e"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        x="52"
        y="56"
      >
        MOISTURE ALERT 75%
      </text>

      <text
        fill="#0d9488"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        x="10"
        y="23"
      >
        90%
      </text>

      <text
        fill="#0f766e"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="600"
        x="10"
        y="55"
      >
        75%
      </text>

      <text
        fill="#64748b"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="600"
        x="10"
        y="88"
      >
        60%
      </text>

      <path
        d="M 45 88 C 180 84, 320 78, 480 50 C 600 32, 700 24, 785 22 L 785 102 L 45 102 Z"
        fill="url(#humidityGradient)"
      />

      <path
        d="M 45 88 C 180 84, 320 78, 480 50 C 600 32, 700 24, 785 22"
        fill="none"
        stroke="#0d9488"
        strokeLinecap="round"
        strokeWidth="2.5"
      />

      <line
        stroke="#0d9488"
        strokeDasharray="2,2"
        strokeWidth="1"
        x1="785"
        x2="785"
        y1="15"
        y2="95"
      />

      <circle
        cx="785"
        cy="22"
        fill="#0d9488"
        r="4"
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      <text
        fill="#0d9488"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        textAnchor="end"
        x="775"
        y="20"
      >
        84.2%
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="45"
        y="108"
      >
        2:00 PM
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="225"
        y="108"
      >
        2:45 PM
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="410"
        y="108"
      >
        3:30 PM
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="595"
        y="108"
      >
        4:15 PM
      </text>

      <text
        fill="#0d9488"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        x="760"
        y="108"
      >
        NOW
      </text>
    </svg>
  );
}

function TemperatureChart() {
  return (
    <svg
      className="w-full h-28 overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 800 110"
    >
      <defs>
        <linearGradient id="temperatureGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      <line
        stroke="#f1f5f9"
        strokeWidth="1"
        x1="45"
        x2="785"
        y1="22"
        y2="22"
      />

      <line
        stroke="#f1f5f9"
        strokeWidth="1"
        x1="45"
        x2="785"
        y1="55"
        y2="55"
      />

      <line
        stroke="#f1f5f9"
        strokeWidth="1"
        x1="45"
        x2="785"
        y1="85"
        y2="85"
      />

      <text
        fill="#64748b"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="600"
        x="10"
        y="25"
      >
        23°C
      </text>

      <text
        fill="#64748b"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="600"
        x="10"
        y="58"
      >
        22°C
      </text>

      <text
        fill="#b45309"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        x="10"
        y="88"
      >
        21°C
      </text>

      <path
        d="M 45 30 C 180 32, 340 45, 520 62 C 640 73, 720 78, 785 80 L 785 102 L 45 102 Z"
        fill="url(#temperatureGradient)"
      />

      <path
        d="M 45 30 C 180 32, 340 45, 520 62 C 640 73, 720 78, 785 80"
        fill="none"
        stroke="#d97706"
        strokeLinecap="round"
        strokeWidth="2.5"
      />

      <line
        stroke="#d97706"
        strokeDasharray="2,2"
        strokeWidth="1"
        x1="785"
        x2="785"
        y1="15"
        y2="95"
      />

      <circle
        cx="785"
        cy="80"
        fill="#d97706"
        r="4"
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      <text
        fill="#d97706"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        textAnchor="end"
        x="775"
        y="77"
      >
        21.4°C
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="45"
        y="108"
      >
        2:00 PM
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="225"
        y="108"
      >
        2:45 PM
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="410"
        y="108"
      >
        3:30 PM
      </text>

      <text
        fill="#94a3b8"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="500"
        x="595"
        y="108"
      >
        4:15 PM
      </text>

      <text
        fill="#d97706"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="700"
        x="760"
        y="108"
      >
        NOW
      </text>
    </svg>
  );
}

function TrendCard({
  icon,
  iconClassName,
  title,
  badge,
  badgeClassName,
  subtitle,
  current,
  unit,
  change,
  changeClassName,
  chart,
}: TrendCardProps) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-3 hover:border-cyan-600/40 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClassName}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {icon}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {title}
              </h3>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClassName}`}
              >
                {badge}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xs text-slate-500">Current:</span>

          <span className="text-lg font-bold text-slate-900 tabular-nums">
            {current}
          </span>

          <span className="text-xs font-medium text-slate-500">{unit}</span>

          <span
            className={`text-xs font-semibold ml-1 flex items-center ${changeClassName}`}
          >
            {change}
          </span>
        </div>
      </div>

      <div className="w-full bg-white border border-slate-200 rounded-lg p-2.5">
        {chart}
      </div>
    </div>
  );
}

function NodeStatusCard({ node }: { node: Node }) {
  const dotClass =
    node.color === "primary" ? "bg-cyan-600" : "bg-teal-600";

  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2 hover:border-cyan-600/40 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />

          <div>
            <span className="text-xs font-bold text-slate-900">
              {node.name}
            </span>

            <span className="text-[11px] text-slate-500 block">
              Location: {node.location}
            </span>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
          {node.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">
            Pressure
          </span>
          <strong className="text-slate-800 font-semibold">
            {node.pressure}
          </strong>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px]">Temp</span>
          <strong className="text-slate-800 font-semibold">
            {node.temperature}
          </strong>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px]">
            Humidity
          </span>
          <strong className="text-slate-800 font-semibold">
            {node.humidity}
          </strong>
        </div>
      </div>
    </div>
  );
}

function ThresholdRule({
  title,
  description,
  current,
  type,
  defaultValue,
  min,
  max,
  step,
}: {
  title: string;
  description: React.ReactNode;
  current: string;
  type: "pressure" | "humidity";
  defaultValue: number;
  min: number;
  max: number;
  step: number;
}) {
  const [value, setValue] = useState(defaultValue);

  const pressure = type === "pressure";

  return (
    <div
      className={`p-3 rounded-lg flex flex-col gap-1.5 ${
        pressure
          ? "bg-amber-50/70 border border-amber-200/80"
          : "bg-teal-50/70 border border-teal-200/80"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-900">{title}</span>

        <span
          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
            pressure
              ? "bg-amber-200 text-amber-900"
              : "bg-teal-200 text-teal-900"
          }`}
        >
          Triggered
        </span>
      </div>

      <p className="text-xs text-slate-600">{description}</p>

      <div className="flex items-center justify-between gap-4 text-xs pt-1">
        <span
          className={`font-semibold ${
            pressure ? "text-amber-800" : "text-teal-800"
          }`}
        >
          {current}
        </span>

        <input
          className={`w-24 h-1.5 rounded-lg cursor-pointer ${
            pressure ? "accent-amber-600" : "accent-teal-600"
          }`}
          max={max}
          min={min}
          step={step}
          type="range"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("3h");
  const [alertVisible, setAlertVisible] = useState(true);
  const [multiNodeCheck, setMultiNodeCheck] = useState(true);

  return (
    <main className="w-full pt-16 bg-slate-50 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {/* WEATHER ALERT */}
        {alertVisible && (
          <div className="relative overflow-hidden rounded-xl bg-amber-50 border border-amber-200 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
                <span className="material-symbols-outlined text-[24px]">
                  thunderstorm
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-amber-900">
                    Weather Alert: Heavy Rain Likely Within 45 Minutes
                  </span>

                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-200/80 text-amber-900">
                    88% Probability
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-amber-950">
                  Air pressure is dropping rapidly across all 3 sensor
                  stations (-1.8 hPa in 3 hours) and air moisture is rising
                  quickly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
              <button
                className="h-8 px-3 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors shadow-sm"
                type="button"
              >
                View Thresholds
              </button>

              <button
                className="h-8 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm"
                onClick={() => setAlertVisible(false)}
                type="button"
              >
                Acknowledge
              </button>
            </div>
          </div>
        )}

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <MetricCard
            icon="compress"
            iconClassName="text-cyan-600"
            title="Air Pressure"
            badge="● Falling fast"
            badgeClassName="bg-amber-100 border border-amber-200 text-amber-800"
            value="1,008.4"
            unit="hPa"
            description="↓ -1.8 hPa in last 3 hours"
            descriptionClassName="text-amber-700"
            footer={
              <>
                <span>
                  Rain threshold:{" "}
                  <strong className="text-slate-800">1,010 hPa</strong>
                </span>
                <span className="text-amber-700 font-bold">
                  Below normal
                </span>
              </>
            }
          />

          <MetricCard
            icon="humidity_percentage"
            iconClassName="text-teal-600"
            title="Air Humidity"
            badge="High Moisture"
            badgeClassName="bg-teal-50 border border-teal-200 text-teal-800"
            value="84.2%"
            description="↑ +6.5% in last hour"
            descriptionClassName="text-teal-700"
            footer={
              <>
                <span>
                  Dew point:{" "}
                  <strong className="text-slate-800">14.1°C</strong>
                </span>
                <span className="text-teal-700 font-medium">
                  Condensing
                </span>
              </>
            }
          />

          <MetricCard
            icon="thermostat"
            iconClassName="text-amber-600"
            title="Temperature"
            badge="Mild / Stable"
            badgeClassName="bg-slate-100 text-slate-700"
            value="21.4°C"
            description="― Within comfortable range"
            descriptionClassName="text-slate-600"
            footer={
              <span>
                24h Range:{" "}
                <strong className="text-slate-800">
                  18.2°C – 24.1°C
                </strong>
              </span>
            }
          />

          <MetricCard
            icon="rainy"
            iconClassName="text-cyan-600"
            title="Rain Risk"
            badge="Rain Expected"
            badgeClassName="bg-amber-100 border border-amber-200 text-amber-800"
            value="High Risk"
            unit="(88%)"
            description="◷ Expected in ~35 to 45 mins"
            descriptionClassName="text-slate-600"
            footer={
              <span>
                Rain sensor:{" "}
                <strong className="text-slate-800">
                  Dry (Pre-rain front)
                </strong>
              </span>
            }
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT */}
          <div className="lg:col-span-8 flex flex-col gap-4 bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-600 text-[22px]">
                    insights
                  </span>

                  <h2 className="text-lg font-bold text-slate-900">
                    Live Sensor Trends (Last 3 Hours)
                  </h2>
                </div>

                <p className="text-xs text-slate-500 mt-0.5">
                  Continuous real-time telemetry comparison across station
                  sensors
                </p>
              </div>

              <div className="flex items-center bg-slate-100 border border-slate-200 p-0.5 rounded-lg shrink-0 text-xs self-start sm:self-center">
                {(
                  [
                    ["3h", "3h"],
                    ["24h", "24h"],
                    ["7d", "7 days"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setTimeRange(value)}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      timeRange === value
                        ? "bg-white text-cyan-700 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* TREND CARDS */}
            <div className="flex flex-col gap-4 pt-1">
              <TrendCard
                icon="compress"
                iconClassName="bg-cyan-50 text-cyan-700"
                title="Air Pressure Trend"
                badge="● Triggered (-1.8 hPa drop)"
                badgeClassName="bg-amber-100 border border-amber-200 text-amber-800"
                subtitle="Rain Threshold line set at 1,010.0 hPa"
                current="1,008.4"
                unit="hPa"
                change="↓ 1,014.0 → 1,008.4"
                changeClassName="text-amber-700"
                chart={<PressureChart />}
              />

              <TrendCard
                icon="humidity_percentage"
                iconClassName="bg-teal-50 text-teal-700"
                title="Air Humidity Trend"
                badge="High Moisture (+24.2% in 3h)"
                badgeClassName="bg-teal-50 border border-teal-200 text-teal-800"
                subtitle="Rapid saturation indicating oncoming cloud condensation"
                current="84.2%"
                unit=""
                change="↑ 60.0% → 84.2%"
                changeClassName="text-teal-700"
                chart={<HumidityChart />}
              />

              <TrendCard
                icon="thermostat"
                iconClassName="bg-amber-100 text-amber-700"
                title="Ambient Temperature Trend"
                badge="Mild / Pre-storm Cooling"
                badgeClassName="bg-slate-100 text-slate-700"
                subtitle="Steady descent as overcast sky blocks solar radiation"
                current="21.4°C"
                unit=""
                change="↓ 22.8°C → 21.4°C"
                changeClassName="text-slate-600"
                chart={<TemperatureChart />}
              />
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    trending_down
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">
                    Pressure Differential
                  </span>
                  <strong className="text-slate-800 font-bold text-sm">
                    -1.8 hPa (Rapid)
                  </strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    water
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">
                    Moisture Accumulation
                  </span>
                  <strong className="text-slate-800 font-bold text-sm">
                    +24.2% in 3 hours
                  </strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    crisis_alert
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">
                    Node Consensus
                  </span>
                  <strong className="text-slate-800 font-bold text-sm">
                    3 of 3 Nodes Agree
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* NODE STATUS */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-600 text-[20px]">
                    hub
                  </span>

                  <h3 className="text-base font-bold text-slate-900">
                    Node Status Overview
                  </h3>
                </div>

                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 whitespace-nowrap">
                  All 3 Connected
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {NODES.map((node) => (
                  <NodeStatusCard key={node.name} node={node} />
                ))}
              </div>
            </div>

            {/* THRESHOLDS */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-600 text-[20px]">
                    notifications_active
                  </span>

                  <h3 className="text-base font-bold text-slate-900">
                    Thresholds & Alerts
                  </h3>
                </div>

                <span className="text-xs font-semibold text-cyan-700">
                  Live Rules
                </span>
              </div>

              <div className="flex flex-col gap-3.5">
                <ThresholdRule
                  title="Pressure Drop Alert"
                  description={
                    <>
                      Alert when pressure drops &gt;{" "}
                      <strong className="text-slate-800">
                        1.5 hPa in 3 hours
                      </strong>
                    </>
                  }
                  current="Current drop: 1.8 hPa"
                  type="pressure"
                  defaultValue={1.5}
                  min={0.5}
                  max={3}
                  step={0.1}
                />

                <ThresholdRule
                  title="High Humidity Alert"
                  description={
                    <>
                      Alert when humidity exceeds{" "}
                      <strong className="text-slate-800">75%</strong>
                    </>
                  }
                  current="Current: 84.2%"
                  type="humidity"
                  defaultValue={75}
                  min={60}
                  max={95}
                  step={5}
                />

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Alert Dispatch Policy
                    </span>

                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Send push & email notification via MQTT when{" "}
                    <strong className="text-slate-800">
                      2 or more nodes agree
                    </strong>
                    .
                  </p>

                  <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 cursor-pointer">
                    <input
                      checked={multiNodeCheck}
                      onChange={(event) =>
                        setMultiNodeCheck(event.target.checked)
                      }
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 h-3.5 w-3.5"
                      type="checkbox"
                    />

                    <span>Prevent false alarms (Multi-sensor check)</span>
                  </label>
                </div>

                <button
                  className="w-full h-9 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    save
                  </span>

                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
