"use client";

import { useState, useTransition } from "react";
import { saveSettings } from "@/app/actions";
import { Bell } from "lucide-react";

type Props = {
  initial: {
    pressureDropHpa: number;
    humidityPct: number;
    multiNodeCheck: boolean;
    minNodesAgree: number;
  };
  currentDrop: number | null;
  currentHumidity: number | null;
};

function RuleCard({
  title,
  description,
  current,
  status,
  tone,
  value,
  onChange,
  min,
  max,
  step,
}: {
  title: string;
  description: React.ReactNode;
  current: string;
  status: "Triggered" | "Normal" | "No data";
  tone: "pressure" | "humidity";
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  const p = tone === "pressure";
  const badge =
    status === "Triggered"
      ? p
        ? "bg-amber-200 text-amber-900"
        : "bg-teal-200 text-teal-900"
      : "bg-slate-200 text-slate-700";

  return (
    <div
      className={`p-3 rounded-lg flex flex-col gap-1.5 ${
        p ? "bg-amber-50/70 border border-amber-200/80" : "bg-teal-50/70 border border-teal-200/80"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-900">{title}</span>
        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${badge}`}>{status}</span>
      </div>

      <p className="text-xs text-slate-600">{description}</p>

      <div className="flex items-center justify-between gap-4 text-xs pt-1">
        <span className={`font-semibold ${p ? "text-amber-800" : "text-teal-800"}`}>{current}</span>
        <input
          className={`w-24 h-1.5 rounded-lg cursor-pointer ${p ? "accent-amber-600" : "accent-teal-600"}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default function ThresholdsPanel({ initial, currentDrop, currentHumidity }: Props) {
  const [pressure, setPressure] = useState(initial.pressureDropHpa);
  const [humidity, setHumidity] = useState(initial.humidityPct);
  const [multi, setMulti] = useState(initial.multiNodeCheck);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const dirty =
    pressure !== initial.pressureDropHpa ||
    humidity !== initial.humidityPct ||
    multi !== initial.multiNodeCheck;

  function onSave() {
    setMsg(null);
    startTransition(async () => {
      const res = await saveSettings({
        pressureDropHpa: pressure,
        humidityPct: humidity,
        multiNodeCheck: multi,
      });
      setMsg(res.ok ? { ok: true, text: "Saved. Predictions updated." } : { ok: false, text: res.error });
    });
  }

  return (
    <div id="thresholds" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 scroll-mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className=" text-cyan-600 text-[20px]"><Bell/></span>
          <h3 className="text-base font-bold text-slate-900">Thresholds & Alerts</h3>
        </div>
        <span className="text-xs font-semibold text-cyan-700">Live Rules</span>
      </div>

      <div className="flex flex-col gap-3.5">
        <RuleCard
          title="Pressure Drop Alert"
          description={
            <>
              Alert when pressure falls ≥ <strong className="text-slate-800">{pressure.toFixed(1)} hPa per 3 hours</strong>
            </>
          }
          current={currentDrop === null ? "Current: collecting data" : `Current drop: ${currentDrop.toFixed(1)} hPa / 3 h`}
          status={currentDrop === null ? "No data" : currentDrop >= pressure ? "Triggered" : "Normal"}
          tone="pressure"
          value={pressure}
          onChange={setPressure}
          min={0.5}
          max={3}
          step={0.1}
        />

        <RuleCard
          title="High Humidity Alert"
          description={
            <>
              Alert when humidity exceeds <strong className="text-slate-800">{humidity}%</strong>
            </>
          }
          current={currentHumidity === null ? "Current: no data" : `Current: ${currentHumidity.toFixed(1)}%`}
          status={currentHumidity === null ? "No data" : currentHumidity >= humidity ? "Triggered" : "Normal"}
          tone="humidity"
          value={humidity}
          onChange={setHumidity}
          min={60}
          max={95}
          step={5}
        />

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Alert Policy</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
              {multi ? "Multi-node" : "Any node"}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            {multi ? (
              <>
                Raise the alert when <strong className="text-slate-800">{initial.minNodesAgree} or more nodes agree</strong>.
              </>
            ) : (
              <>
                Raise the alert when <strong className="text-slate-800">any single node</strong> signals rain.
              </>
            )}
          </p>

          <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 cursor-pointer">
            <input
              checked={multi}
              onChange={(e) => setMulti(e.target.checked)}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 h-3.5 w-3.5"
              type="checkbox"
            />
            <span>Prevent false alarms (multi-node check)</span>
          </label>
        </div>

        <button
          className="w-full h-9 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
          type="button"
          onClick={onSave}
          disabled={!dirty || pending}
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          {pending ? "Saving…" : "Save Changes"}
        </button>

        {msg && (
          <p className={`text-xs font-medium ${msg.ok ? "text-teal-700" : "text-red-600"}`}>{msg.text}</p>
        )}
      </div>
    </div>
  );
}
