"use client";

import { useRef, useState } from "react";

type Station = {
  value: string;
  label: string;
};

const stations: Station[] = [
  { value: "all", label: "All Stations" },
  {
    value: "delta-04",
    label: "Station Delta-04 (Clear Creek)",
  },
  {
    value: "bravo-02",
    label: "Station Bravo-02 (Upper Ridge)",
  },
  {
    value: "alpha-01",
    label: "Station Alpha-01 (Basin Outlet)",
  },
];

type AlertCardProps = {
  category: string;
  status: string;
  statusTone: "tertiary" | "primary" | "neutral";
  icon: string;
  title: string;
  description: string;
  detected: string;
  detailLabel: string;
  detail: string;
};

function AlertCard({
  category,
  status,
  statusTone,
  icon,
  title,
  description,
  detected,
  detailLabel,
  detail,
}: AlertCardProps) {
  const toneClasses = {
    tertiary: {
      bar: "bg-orange-600",
      iconBg: "bg-orange-100",
      icon: "text-orange-700",
      status: "bg-orange-100 text-orange-800",
      dot: "bg-orange-600",
    },
    primary: {
      bar: "bg-cyan-700",
      iconBg: "bg-cyan-100",
      icon: "text-cyan-700",
      status: "bg-cyan-100 text-cyan-800",
      dot: "bg-cyan-700",
    },
    neutral: {
      bar: "bg-slate-300",
      iconBg: "bg-slate-100",
      icon: "text-slate-500",
      status: "bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
    },
  };

  const tone = toneClasses[statusTone];

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`absolute left-0 right-0 top-0 h-1 ${tone.bar}`}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {category}
          </span>

          <span
            className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${tone.status}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
            {status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`rounded-lg p-2 ${tone.iconBg} ${tone.icon}`}>
            <span className="material-symbols-outlined text-[24px]">
              {icon}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>

        <p className="text-xs leading-4 text-slate-500">{description}</p>
      </div>

      <div className="-mx-6 -mb-6 mt-6 flex flex-col gap-1 bg-slate-50/80 p-6">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Detected:</span>
          <span className="font-semibold text-slate-900">{detected}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{detailLabel}:</span>
          <span className={`font-medium ${tone.icon}`}>{detail}</span>
        </div>
      </div>
    </div>
  );
}

type ActivityItemProps = {
  icon: string;
  iconTone: "orange" | "cyan" | "neutral";
  title: string;
  status: string;
  description: string;
  time: string;
  station: string;
  cleared?: boolean;
};

function ActivityItem({
  icon,
  iconTone,
  title,
  status,
  description,
  time,
  station,
  cleared = false,
}: ActivityItemProps) {
  const tones = {
    orange: "bg-orange-100 text-orange-700",
    cyan: "bg-cyan-100 text-cyan-700",
    neutral: "bg-slate-100 text-slate-500",
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg p-4 transition-colors hover:bg-slate-50 ${
        cleared ? "opacity-75" : "bg-slate-50/50"
      }`}
    >
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm ${tones[iconTone]}`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {icon}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-slate-900">{title}</span>

          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
              cleared
                ? "bg-slate-100 text-slate-500"
                : "bg-cyan-100 text-cyan-800"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="text-xs text-slate-500">{description}</p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
          <span className="material-symbols-outlined text-[14px]">
            schedule
          </span>
          <span>{time}</span>
          <span>•</span>
          <span>{station}</span>
        </div>
      </div>
    </div>
  );
}

type ThresholdFieldProps = {
  label: string;
  description: string;
  suffix: string;
  category: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

function ThresholdField({
  label,
  description,
  suffix,
  category,
  value,
  min,
  max,
  step,
  onChange,
}: ThresholdFieldProps) {
  const increase = () => {
    onChange(Math.min(max, Number((value + step).toFixed(1))));
  };

  const decrease = () => {
    onChange(Math.max(min, Number((value - step).toFixed(1))));
  };

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-slate-50/40 p-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-900">{label}</label>

        <span className="text-[10px] font-bold uppercase text-slate-500">
          {category}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => {
              const next = Number(event.target.value);

              if (Number.isNaN(next)) {
                return;
              }

              onChange(Math.min(max, Math.max(min, next)));
            }}
            className="h-10 w-full rounded-lg bg-white px-4 pr-16 text-right text-xl font-bold text-slate-900 shadow-sm outline-none"
          />

          <span className="absolute right-3 top-2.5 text-sm font-bold text-slate-500">
            {suffix}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={increase}
            className="flex h-4 w-7 items-center justify-center rounded bg-white text-xs text-slate-900 shadow-sm hover:bg-slate-100"
            aria-label={`Increase ${label}`}
          >
            ▲
          </button>

          <button
            type="button"
            onClick={decrease}
            className="flex h-4 w-7 items-center justify-center rounded bg-white text-xs text-slate-900 shadow-sm hover:bg-slate-100"
            aria-label={`Decrease ${label}`}
          >
            ▼
          </button>
        </div>
      </div>

      <span className="text-xs leading-4 text-slate-500">{description}</span>
    </div>
  );
}

export default function AlertsAndThresholdsPage() {
  const [station, setStation] = useState("all");

  const [humidity, setHumidity] = useState(75);
  const [pressureDrop, setPressureDrop] = useState(1.5);
  const [trendPeriod, setTrendPeriod] = useState(3);
  const [predictionWindow, setPredictionWindow] = useState(3);

  const [showToast, setShowToast] = useState(false);

  const humidityInputRef = useRef<HTMLInputElement>(null);

  const showSaveToast = () => {
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
    }, 4500);
  };

  const resetDefaults = () => {
    setHumidity(75);
    setPressureDrop(1.5);
    setTrendPeriod(3);
    setPredictionWindow(3);

    showSaveToast();
  };

  const focusFirst = () => {
    humidityInputRef.current?.focus();
    humidityInputRef.current?.select();
  };

  return (
    <main className="min-h-screen w-full bg-[#f8f9ff] pt-16">
      <div className="flex w-full flex-col">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 bg-[#eff4ff] px-5 py-6 shadow-sm md:flex-row md:items-center lg:px-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px] text-cyan-700">
                notification_important
              </span>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Alerts &amp; Thresholds
              </h1>
            </div>

            <p className="text-sm text-slate-500">
              Active rainfall prediction alerts and environmental trigger
              thresholds
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative inline-flex items-center rounded-lg bg-white px-3 py-2 shadow-sm">
              <label
                htmlFor="station-picker"
                className="mr-1 text-[11px] font-semibold uppercase text-slate-500"
              >
                Station:
              </label>

              <select
                id="station-picker"
                value={station}
                onChange={(event) => setStation(event.target.value)}
                className="cursor-pointer bg-transparent pr-6 text-sm font-semibold text-slate-900 outline-none"
              >
                {stations.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-2 text-[18px] text-slate-500">
                <span className="material-symbols-outlined">
                  unfold_more
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-[#e5eeff] px-3 py-2 text-[11px] font-semibold text-slate-500 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-cyan-700">
                schedule
              </span>
              <span>Updated: 12:00 PM</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-6 px-5 py-6 lg:px-8">
          {/* Monitoring Core */}
          <div className="flex flex-col justify-between gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                <span className="material-symbols-outlined text-[24px]">
                  cloud_sync
                </span>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Precipitation Monitoring Core
                </div>

                <div className="text-xs text-slate-500">
                  Real-time evaluation against 4 distinct hydro-meteorological
                  tripwires
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start rounded-full bg-cyan-100 px-3 py-1.5 text-[11px] font-semibold text-cyan-900 sm:self-auto">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-600" />
              <span>3 Active Alerts • 1 Inactive Baseline</span>
            </div>
          </div>

          {/* Active Rainfall Alerts */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Active Rainfall Alerts
                </h2>

                <p className="text-xs text-slate-500">
                  Current state of environmental indicators directly impacting
                  precipitation forecasting
                </p>
              </div>

              <div className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:flex">
                <span className="material-symbols-outlined text-[14px]">
                  info
                </span>
                <span>4 Telemetry Rules</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <AlertCard
                category="Prediction Synthesis"
                status="ACTIVE"
                statusTone="tertiary"
                icon="rainy"
                title="Rain Likely"
                description="Environmental conditions indicate a possibility of rain within the forecast window."
                detected="11:45 AM (15m ago)"
                detailLabel="Condition"
                detail="Humidity (85.1%) + Pressure drop"
              />

              <AlertCard
                category="Moisture Index"
                status="TRIGGERED"
                statusTone="primary"
                icon="humidity_high"
                title="High Humidity"
                description="Relative air humidity has exceeded the configured 75% threshold."
                detected="11:15 AM (45m ago)"
                detailLabel="Reading"
                detail="85.1% RH (Threshold: 75%)"
              />

              <AlertCard
                category="Atmosphere State"
                status="TRIGGERED"
                statusTone="tertiary"
                icon="airwave"
                title="Rapid Pressure Drop"
                description="Atmospheric barometric pressure has dropped beyond the configured limit."
                detected="10:30 AM (1h 30m ago)"
                detailLabel="Rate"
                detail="-1.8 hPa / 3h (Limit: 1.5)"
              />

              <AlertCard
                category="Physical Surface"
                status="DRY BASELINE"
                statusTone="neutral"
                icon="water_drop"
                title="Rain Detected"
                description="The optical surface rain sensor has detected precipitation."
                detected="No active detection"
                detailLabel="Condition"
                detail="Sensor dry; 0 droplets registered"
              />
            </div>
          </section>

          {/* Thresholds + Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Prediction Thresholds */}
            <section className="flex flex-col gap-4 lg:col-span-7">
              <div className="flex flex-col gap-6 rounded-xl bg-white p-5 shadow-sm lg:p-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Calibration Suite
                    </span>

                    <h2 className="text-xl font-bold text-slate-900">
                      Prediction Thresholds
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5 self-start rounded bg-[#dce9ff] px-2 py-1 text-[10px] text-slate-500">
                    <span className="material-symbols-outlined text-[14px]">
                      tune
                    </span>
                    <span>Algorithm v2.4 Standard</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="flex items-start gap-3 rounded-lg bg-[#eff4ff] p-3">
                  <span className="material-symbols-outlined mt-0.5 text-[20px] text-cyan-700">
                    lightbulb
                  </span>

                  <p className="text-sm text-slate-900">
                    When humidity exceeds{" "}
                    <span className="font-semibold text-cyan-700">
                      {humidity}%
                    </span>{" "}
                    and air pressure drops more than{" "}
                    <span className="font-semibold text-cyan-700">
                      {pressureDrop.toFixed(1)} hPa
                    </span>{" "}
                    across{" "}
                    <span className="font-semibold text-cyan-700">
                      {trendPeriod} hours
                    </span>
                    , the system automatically triggers a{" "}
                    <span className="font-semibold text-orange-700">
                      &quot;Rain Likely&quot;
                    </span>{" "}
                    alert.
                  </p>
                </div>

                <form
                  className="flex flex-col gap-6"
                  onSubmit={(event) => {
                    event.preventDefault();
                    showSaveToast();
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ThresholdField
                      label="Humidity Threshold"
                      category="Air Moisture"
                      suffix="%"
                      description="Trigger condition: Relative humidity ≥ threshold"
                      value={humidity}
                      min={30}
                      max={100}
                      step={1}
                      onChange={setHumidity}
                    />

                    <ThresholdField
                      label="Pressure Drop"
                      category="Barometric Delta"
                      suffix="hPa"
                      description="Trigger condition: Barometric drop ≥ threshold"
                      value={pressureDrop}
                      min={0.1}
                      max={10}
                      step={0.1}
                      onChange={setPressureDrop}
                    />

                    <ThresholdField
                      label="Pressure Trend Period"
                      category="Sample Rate"
                      suffix="hours"
                      description="Evaluation timeframe for descent rate"
                      value={trendPeriod}
                      min={1}
                      max={12}
                      step={1}
                      onChange={setTrendPeriod}
                    />

                    <ThresholdField
                      label="Prediction Window"
                      category="Horizon"
                      suffix="hours"
                      description="Lookahead forecast validity timeframe"
                      value={predictionWindow}
                      min={1}
                      max={24}
                      step={1}
                      onChange={setPredictionWindow}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={resetDefaults}
                      className="flex items-center gap-1 text-left text-xs font-semibold text-slate-500 hover:text-slate-900"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        restart_alt
                      </span>

                      <span>Reset to Defaults</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={focusFirst}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-200"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>

                        <span>Edit Thresholds</span>
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-1.5 rounded-lg bg-cyan-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-800"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          check_circle
                        </span>

                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Toast */}
                {showToast && (
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-cyan-100 p-3 text-cyan-900 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="material-symbols-outlined text-[20px] text-cyan-700">
                        done_all
                      </span>

                      <span>
                        Prediction thresholds updated across all active
                        stations.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowToast(false)}
                      className="shrink-0 hover:opacity-70"
                      aria-label="Close notification"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Recent Alert Activity */}
            <section className="flex flex-col gap-4 lg:col-span-5">
              <div className="flex h-full flex-col gap-6 rounded-xl bg-white p-5 shadow-sm lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Audit Sequence
                    </span>

                    <h2 className="text-xl font-bold text-slate-900">
                      Recent Alert Activity
                    </h2>
                  </div>

                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                    TODAY
                  </span>
                </div>

                <div className="relative flex flex-col gap-3">
                  <ActivityItem
                    icon="rainy"
                    iconTone="orange"
                    title="Rain Likely"
                    status="Active"
                    description="Combined humidity & pressure drop triggers hit"
                    time="11:45 AM"
                    station="Station Delta-04"
                  />

                  <ActivityItem
                    icon="humidity_high"
                    iconTone="cyan"
                    title="High Humidity"
                    status="Active"
                    description="Crossed 75% threshold (currently 85.1%)"
                    time="11:15 AM"
                    station="Sensors Delta-H1, H2"
                  />

                  <ActivityItem
                    icon="trending_down"
                    iconTone="orange"
                    title="Rapid Pressure Drop"
                    status="Active"
                    description="Barometric drop reached -1.8 hPa / 3h (rate exceeded)"
                    time="10:30 AM"
                    station="Baro-04 Clear Creek"
                  />

                  <ActivityItem
                    icon="check"
                    iconTone="neutral"
                    title="High Humidity"
                    status="Cleared"
                    description="Resolved • Air humidity normalized to 68%"
                    time="07:15 AM"
                    station="System Auto-Recovery"
                    cleared
                  />
                </div>

                <div className="mt-auto flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-500">
                  <span className="text-[10px] font-bold uppercase">
                    Automatic Sync Rate
                  </span>

                  <span className="text-xs font-semibold text-cyan-700">
                    Live Polling (60s)
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Status */}
          <div className="flex flex-col justify-between gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                <span className="material-symbols-outlined text-[24px]">
                  verified
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                  Station Delta-04 Hydro-Mesh Feed Operational
                </span>

                <span className="text-xs text-slate-500">
                  All 4 rain alert indices are being evaluated every 60 seconds
                  against nominal calibrated sensor inputs.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-[16px]">
                history
              </span>

              <span>View Telemetry History</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
