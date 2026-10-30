import Link from "next/link";
import { CloudRain, CloudLightning, Gauge, Droplets, WifiOff, CircleCheck, ArrowLeft, Clock } from "lucide-react";
import { getLatestPerNode, getSeries, getSettings } from "@/lib/db/overview";
import { getNodes } from "@/lib/db/queries";
import { ONLINE_WINDOW_MS, assess, type NodeInput } from "@/lib/prediction/engine";
import AutoRefresh from "../_components/auto-refresh";
import { getNow } from "@/lib/time";

export const dynamic = "force-dynamic";

type Severity = "critical" | "warning" | "info";

type AlertItem = {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  icon: typeof CloudRain;
};

const SEVERITY_STYLES: Record<Severity, { card: string; icon: string; pill: string; label: string }> = {
  critical: { card: "border-cyan-300 bg-cyan-50", icon: "bg-cyan-100 text-cyan-700", pill: "bg-cyan-600 text-white", label: "Critical" },
  warning: { card: "border-amber-200 bg-amber-50", icon: "bg-amber-100 text-amber-700", pill: "bg-amber-500 text-white", label: "Warning" },
  info: { card: "border-slate-200 bg-white", icon: "bg-slate-100 text-slate-600", pill: "bg-slate-500 text-white", label: "Info" },
};

function f(n: number | null | undefined, d = 1) {
  if (n == null) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function avg(xs: (number | null | undefined)[]) {
  const v = xs.filter((x): x is number => x != null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

function ago(ms: number) {
  const m = Math.round(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
}

export default async function AlertsPage() {
  const now = getNow();

  const [nodeRows, latest, settings, series] = await Promise.all([getNodes(), getLatestPerNode(), getSettings(), getSeries("3h", now)]);

  /* nodes */
  const latestById = new Map(latest.map((r) => [r.nodeId, r]));
  const nodeViews = nodeRows.map((n) => {
    const l = latestById.get(n.id) ?? null;
    const online = !!l && now - l.recordedAt.getTime() <= ONLINE_WINDOW_MS;
    return { id: n.id, name: n.name, latest: l, online };
  });
  const onlineViews = nodeViews.filter((n) => n.online && n.latest);

  /* prediction */
  const inputs: NodeInput[] = nodeViews.map((n) => ({
    nodeId: n.id,
    online: n.online,
    isRaining: n.latest?.isRaining ?? false,
    pressure: series[n.id]?.pressure ?? [],
    humidity: series[n.id]?.humidity ?? [],
    temperature: series[n.id]?.temperature ?? [],
  }));
  const result = assess(inputs, settings, now);

  const humidityNow = avg(onlineViews.map((n) => n.latest!.humidity));
  const drop = result.pressureDrop3h;
  const nameOf = (id: string) => nodeViews.find((n) => n.id === id)?.name ?? id;

  /* build live alerts from the current state */
  const alerts: AlertItem[] = [];

  if (result.level === "raining") {
    const wet = result.nodes.filter((n) => n.raining).map((n) => nameOf(n.nodeId));
    alerts.push({
      id: "raining",
      severity: "critical",
      title: "Rain detected",
      detail: `Rain sensor is wet on ${wet.join(", ")} (${result.nodesRaining} of ${result.nodesOnline} online).`,
      icon: CloudRain,
    });
  }

  if (result.level === "high") {
    alerts.push({
      id: "rain-likely",
      severity: "critical",
      title: "Rain likely",
      detail: `Risk score ${result.score ?? "—"}/100. ${result.nodesFlagged} of ${result.nodesAssessed} nodes signal rain.${result.eta ? ` Estimated rain in ${result.eta}.` : ""}`,
      icon: CloudLightning,
    });
  }

  if (result.level === "moderate") {
    alerts.push({
      id: "rain-watch",
      severity: "warning",
      title: "Rain risk building",
      detail: `Risk score ${result.score ?? "—"}/100. Conditions are being watched, no alert threshold crossed yet.`,
      icon: CloudRain,
    });
  }

  if (drop !== null && drop >= settings.pressureDropHpa) {
    alerts.push({
      id: "pressure",
      severity: "warning",
      title: "Pressure falling fast",
      detail: `Down ${f(drop)} hPa over 3 hours (alert at ≥ ${f(settings.pressureDropHpa)} hPa).`,
      icon: Gauge,
    });
  }

  if (humidityNow !== null && humidityNow >= settings.humidityPct) {
    alerts.push({
      id: "humidity",
      severity: "warning",
      title: "High humidity",
      detail: `Averaging ${f(humidityNow)}% across online nodes (alert at ≥ ${settings.humidityPct}%).`,
      icon: Droplets,
    });
  }

  for (const n of nodeViews.filter((x) => !x.online)) {
    alerts.push({
      id: `offline-${n.id}`,
      severity: "info",
      title: `${n.name} offline`,
      detail: n.latest ? `Last reading ${ago(now - n.latest.recordedAt.getTime())}.` : "No readings received yet.",
      icon: WifiOff,
    });
  }

  const headline =
    result.level === "raining"
      ? { text: "Raining now", sub: "Rain sensor is wet", cls: "from-cyan-600 to-cyan-700" }
      : result.level === "high"
        ? { text: "Rain likely", sub: result.eta ? `Expected in ${result.eta}` : "Alert threshold reached", cls: "from-amber-500 to-amber-600" }
        : result.level === "moderate"
          ? { text: "Watching", sub: "Risk is building", cls: "from-amber-400 to-amber-500" }
          : result.level === "collecting"
            ? { text: "Warming up", sub: "Collecting pressure history", cls: "from-slate-500 to-slate-600" }
            : { text: "All clear", sub: "No rain expected", cls: "from-teal-600 to-teal-700" };

  return (
    <main className="min-h-screen bg-slate-50">
      <AutoRefresh intervalMs={30000} />

      {/* top bar */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 active:text-slate-900">
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
          <h1 className="text-base font-bold text-slate-900">Alerts</h1>
          <span className="w-[88px]" aria-hidden />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
        {/* status banner */}
        <section className={`rounded-2xl p-5 text-white bg-gradient-to-br shadow-sm ${headline.cls}`}>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Current status</p>
          <p className="text-3xl font-extrabold tracking-tight mt-1">{headline.text}</p>
          <p className="text-sm opacity-90 mt-0.5">{headline.sub}</p>
          <div className="mt-4 pt-3 border-t border-white/25 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold tabular-nums">{result.score ?? "—"}</p>
              <p className="text-[11px] opacity-80">Risk score</p>
            </div>
            <div>
              <p className="text-lg font-bold tabular-nums">
                {result.nodesFlagged}/{result.nodesAssessed}
              </p>
              <p className="text-[11px] opacity-80">Nodes agree</p>
            </div>
            <div>
              <p className="text-lg font-bold tabular-nums">
                {result.nodesOnline}/{nodeViews.length}
              </p>
              <p className="text-[11px] opacity-80">Online</p>
            </div>
          </div>
        </section>

        {/* active alerts */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Active alerts</h2>
            <span className="text-xs font-semibold text-slate-500">{alerts.length}</span>
          </div>

          {alerts.length === 0 ? (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <CircleCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-teal-900">No active alerts</p>
                <p className="text-xs text-teal-800">All nodes are reporting normal conditions.</p>
              </div>
            </div>
          ) : (
            alerts.map((a) => {
              const s = SEVERITY_STYLES[a.severity];
              const Icon = a.icon;
              return (
                <article key={a.id} className={`rounded-xl border p-4 flex gap-3 ${s.card}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.icon}`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${s.pill}`}>{s.label}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.detail}</p>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* node readings */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Nodes</h2>
          {nodeViews.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No nodes yet.</p>}
          {nodeViews.map((n) => (
            <div key={n.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{n.name}</span>
                <span className={`text-[11px] font-semibold flex items-center gap-1 ${n.online ? "text-teal-700" : "text-slate-500"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${n.online ? "bg-teal-600" : "bg-slate-400"}`} />
                  {n.online ? "Online" : "Offline"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Pressure</span>
                  <strong className="text-slate-800">{n.latest ? `${f(n.latest.pressure)} hPa` : "—"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Temp</span>
                  <strong className="text-slate-800">{n.latest ? `${f(n.latest.temperature)}°C` : "—"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Humidity</span>
                  <strong className="text-slate-800">{n.latest ? `${f(n.latest.humidity)}%` : "—"}</strong>
                </div>
              </div>
              {n.latest && (
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <Clock className="size-3" />
                  Updated {ago(now - n.latest.recordedAt.getTime())}
                </p>
              )}
            </div>
          ))}
        </section>

        <p className="text-[11px] text-slate-400 text-center pb-4">Refreshes every 30 s · ETA is an indicative estimate</p>
      </div>
    </main>
  );
}
