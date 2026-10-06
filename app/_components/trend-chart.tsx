"use client";

import { useEffect, useRef, useState } from "react";

export type ChartPoint = { t: number; v: number };
export type ChartSeries = { name: string; color: string; points: ChartPoint[] };

type Props = {
  series: ChartSeries[];
  from: number;
  to: number;
  binMs: number;
  unit: string;
  decimals?: number;
};

const H = 200;
const PAD = { l: 48, r: 14, t: 12, b: 26 };
const TZ = "Africa/Lagos";

export default function TrendChart({ series, from, to, binMs, unit, decimals = 1 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  const [hoverX, setHoverX] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setW(Math.max(280, el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const all = series.flatMap((s) => s.points);
  const longSpan = to - from > 36 * 3600e3;

  const tickLabel = (t: number) =>
    longSpan
      ? new Date(t).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", timeZone: TZ })
      : new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

  const fullLabel = (t: number) =>
    new Date(t).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: TZ,
    });

  if (all.length === 0) {
    return (
      <div ref={wrapRef} className="w-full">
        <div className="h-[200px] flex items-center justify-center text-xs text-slate-400">
          No readings in this window yet.
        </div>
      </div>
    );
  }

  let lo = Math.min(...all.map((p) => p.v));
  let hi = Math.max(...all.map((p) => p.v));
  if (hi - lo < 0.5) {
    const mid = (hi + lo) / 2;
    lo = mid - 0.5;
    hi = mid + 0.5;
  }
  const pad = (hi - lo) * 0.12;
  lo -= pad;
  hi += pad;

  const innerW = w - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const x = (t: number) => PAD.l + ((t - from) / (to - from)) * innerW;
  const y = (v: number) => PAD.t + (1 - (v - lo) / (hi - lo)) * innerH;

  const yTicks = [0, 1, 2, 3].map((i) => lo + ((hi - lo) * i) / 3);
  const xTicks = [0, 1, 2, 3, 4].map((i) => from + ((to - from) * i) / 4);

  function pathFor(points: ChartPoint[]) {
    let d = "";
    let prev: number | null = null;
    for (const p of points) {
      const cmd = prev === null || p.t - prev > binMs * 3 ? "M" : "L";
      d += `${cmd}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)} `;
      prev = p.t;
    }
    return d;
  }

  // Hover: nearest point per series
  const hoverT =
    hoverX === null ? null : from + ((hoverX - PAD.l) / innerW) * (to - from);

  const hovered =
    hoverT === null
      ? []
      : series.map((s) => {
          let best: ChartPoint | null = null;
          let bestD = Infinity;
          for (const p of s.points) {
            const d = Math.abs(p.t - hoverT);
            if (d < bestD) {
              bestD = d;
              best = p;
            }
          }
          return { s, p: best && bestD <= binMs * 2 ? best : null };
        });

  const snap = hovered.find((h) => h.p)?.p ?? null;

  return (
    <div ref={wrapRef} className="w-full">
      <div className="relative">
        <svg
          width={w}
          height={H}
          className="block"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const px = e.clientX - r.left;
            setHoverX(px >= PAD.l && px <= w - PAD.r ? px : null);
          }}
          onPointerLeave={() => setHoverX(null)}
        >
          {/* grid + y labels */}
          {yTicks.map((v, i) => (
            <g key={i}>
              <line x1={PAD.l} x2={w - PAD.r} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={PAD.l - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill="#64748b">
                {v.toFixed(decimals)}
              </text>
            </g>
          ))}

          {/* x labels */}
          {xTicks.map((t, i) => (
            <text
              key={i}
              x={x(t)}
              y={H - 8}
              textAnchor={i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"}
              fontSize="10"
              fill="#64748b"
            >
              {tickLabel(t)}
            </text>
          ))}

          {/* lines */}
          {series.map((s) => (
            <g key={s.name}>
              <path d={pathFor(s.points)} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" />
              {s.points.length <= 30 &&
                s.points.map((p) => (
                  <circle key={p.t} cx={x(p.t)} cy={y(p.v)} r="2" fill={s.color} />
                ))}
              <circle
                cx={x(s.points[s.points.length - 1].t)}
                cy={y(s.points[s.points.length - 1].v)}
                r="3.5"
                fill={s.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* crosshair */}
          {snap && (
            <>
              <line x1={x(snap.t)} x2={x(snap.t)} y1={PAD.t} y2={H - PAD.b} stroke="#94a3b8" strokeDasharray="3 3" />
              {hovered.map(
                ({ s, p }) =>
                  p && <circle key={s.name} cx={x(p.t)} cy={y(p.v)} r="4" fill={s.color} stroke="white" strokeWidth="1.5" />
              )}
            </>
          )}
        </svg>

        {snap && (
          <div
            className="pointer-events-none absolute top-0 z-10 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] shadow-md"
            style={{
              left: Math.min(Math.max(x(snap.t), 90), w - 90),
              transform: "translateX(-50%)",
            }}
          >
            <div className="mb-1 font-semibold text-slate-700 whitespace-nowrap">{fullLabel(snap.t)}</div>
            {hovered.map(
              ({ s, p }) =>
                p && (
                  <div key={s.name} className="flex items-center gap-1.5 whitespace-nowrap text-slate-600">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.name}</span>
                    <strong className="ml-auto pl-3 text-slate-900">
                      {p.v.toFixed(decimals)} {unit}
                    </strong>
                  </div>
                )
            )}
          </div>
        )}
      </div>

      {/* legend */}
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 px-1 text-[11px] text-slate-600">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
