import Link from "next/link";
import { MetricCardProps, TrendCardProps } from "@/lib/types/overview";
import { CHART_RANGES, getLatestPerNode, getSeries, getSettings, getTempRange24h, parseChartRange } from "@/lib/db/overview";
import { CloudRain, CloudLightning, Gauge, Droplets, Thermometer, TrendingDown, Waves, CircleAlert, Network, ChartNoAxesCombined } from "lucide-react";
import { getNodes } from "@/lib/db/queries";
import { ONLINE_WINDOW_MS, assess, type NodeInput, type RiskLevel } from "@/lib/prediction/engine";
import AlertBanner from "./_components/alert-banner";
import AutoRefresh from "./_components/auto-refresh";
import ThresholdsPanel from "./_components/thresholds-panel";
import TrendChart, { type ChartSeries } from "./_components/trend-chart";

export const dynamic = "force-dynamic";

const COLORS = ["#0891b2", "#0d9488", "#d97706", "#6366f1", "#e11d48"];

/* ---------- helpers ---------- */

function f(n: number | null | undefined, d = 1) {
  if (n == null) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function avg(xs: (number | null | undefined)[]) {
  const v = xs.filter((x): x is number => x != null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

function dewPoint(tempC: number, rh: number) {
  const a = 17.62;
  const b = 243.12;
  const g = Math.log(rh / 100) + (a * tempC) / (b + tempC);
  return (b * g) / (a - g);
}

function ago(ms: number) {
  const m = Math.round(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
}

function startEnd(series: ChartSeries[]) {
  if (series.length === 0) return null;
  return {
    start: avg(series.map((s) => s.points[0].v)) as number,
    end: avg(series.map((s) => s.points[s.points.length - 1].v)) as number,
  };
}

const LEVELS: Record<RiskLevel, { label: string; badge: string; badgeClass: string }> = {
  collecting: { label: "Collecting data", badge: "Warming up", badgeClass: "bg-slate-100 text-slate-700" },
  low: { label: "Low Risk", badge: "No rain expected", badgeClass: "bg-teal-50 border border-teal-200 text-teal-800" },
  moderate: { label: "Moderate Risk", badge: "Watch", badgeClass: "bg-amber-50 border border-amber-200 text-amber-800" },
  high: { label: "High Risk", badge: "Rain Likely", badgeClass: "bg-amber-100 border border-amber-200 text-amber-800" },
  raining: { label: "Raining", badge: "Rain detected", badgeClass: "bg-cyan-100 border border-cyan-200 text-cyan-800" },
};

/* ---------- presentational components ---------- */

function MetricCard({ icon, iconClassName, title, badge, badgeClassName, value, unit, description, descriptionClassName, footer }: MetricCardProps) {
  const Icon = icon;
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-cyan-600/40 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[20px] ${iconClassName}`}>{<Icon className={`size-5 ${iconClassName}`} />}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${badgeClassName}`}>{badge}</span>
      </div>

      <div className="my-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">{value}</span>
          {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
        </div>
        <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${descriptionClassName}`}>{description}</p>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">{footer}</div>
    </div>
  );
}

function TrendCard({ icon, iconClassName, title, badge, badgeClassName, subtitle, current, unit, change, changeClassName, chart }: TrendCardProps) {
  const Icon = icon;
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-3 hover:border-cyan-600/40 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClassName}`}>
            <span className="material-symbols-outlined text-[18px]">{<Icon size={18} />}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h3>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClassName}`}>{badge}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xs text-slate-500">Current:</span>
          <span className="text-lg font-bold text-slate-900 tabular-nums">{current}</span>
          <span className="text-xs font-medium text-slate-500">{unit}</span>
          <span className={`text-xs font-semibold ml-1 flex items-center ${changeClassName}`}>{change}</span>
        </div>
      </div>

      <div className="w-full bg-white border border-slate-200 rounded-lg p-2.5">{chart}</div>
    </div>
  );
}

function NodeStatusCard({
  name,
  location,
  color,
  status,
  online,
  pressure,
  temperature,
  humidity,
}: {
  name: string;
  location: string | null;
  color: string;
  status: string;
  online: boolean;
  pressure: string;
  temperature: string;
  humidity: string;
}) {
  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2 hover:border-cyan-600/40 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <div>
            <span className="text-xs font-bold text-slate-900">{name}</span>
            {location && <span className="text-[11px] text-slate-500 block">Location: {location}</span>}
          </div>
        </div>

        <span className={`text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap ${online ? "text-teal-700" : "text-slate-500"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${online ? "bg-teal-600" : "bg-slate-400"}`} />
          {status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">Pressure</span>
          <strong className="text-slate-800 font-semibold">{pressure}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Temp</span>
          <strong className="text-slate-800 font-semibold">{temperature}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Humidity</span>
          <strong className="text-slate-800 font-semibold">{humidity}</strong>
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default async function OverviewPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const range = parseChartRange(sp.range);
  const cfg = CHART_RANGES[range];
  const now = Date.now();

  const [nodeRows, latest, settings, tempRange, predSeries, rangeSeries] = await Promise.all([
    getNodes(),
    getLatestPerNode(),
    getSettings(),
    getTempRange24h(now),
    getSeries("3h", now),
    range === "3h" ? Promise.resolve(null) : getSeries(range, now),
  ]);
  const chartData = rangeSeries ?? predSeries;
console.log(nodeRows, latest, settings, tempRange, predSeries)
  /* nodes */
  const latestById = new Map(latest.map((r) => [r.nodeId, r]));
  const nodeViews = nodeRows.map((n, i) => {
    const l = latestById.get(n.id) ?? null;
    const online = !!l && now - l.recordedAt.getTime() <= ONLINE_WINDOW_MS;
    return { id: n.id, name: n.name, location: n.location, color: COLORS[i % COLORS.length], latest: l, online };
  });
  const onlineViews = nodeViews.filter((n) => n.online && n.latest);

  /* prediction */
  const inputs: NodeInput[] = nodeViews.map((n) => ({
    nodeId: n.id,
    online: n.online,
    isRaining: n.latest?.isRaining ?? false,
    pressure: predSeries[n.id]?.pressure ?? [],
    humidity: predSeries[n.id]?.humidity ?? [],
    temperature: predSeries[n.id]?.temperature ?? [],
  }));
  const result = assess(inputs, settings, now);
  const level = LEVELS[result.level];

  /* current values (average of online nodes' latest readings) */
  const pressureNow = avg(onlineViews.map((n) => n.latest!.pressure));
  const humidityNow = avg(onlineViews.map((n) => n.latest!.humidity));
  const tempNow = avg(onlineViews.map((n) => n.latest!.temperature));
  const dew = tempNow != null && humidityNow != null && humidityNow > 0 ? dewPoint(tempNow, humidityNow) : null;

  /* charts */
  const toSeries = (metric: "pressure" | "humidity" | "temperature"): ChartSeries[] =>
    nodeViews.map((n) => ({ name: n.name, color: n.color, points: chartData[n.id]?.[metric] ?? [] })).filter((s) => s.points.length > 0);

  const pressureSeries = toSeries("pressure");
  const humiditySeries = toSeries("humidity");
  const tempSeries = toSeries("temperature");

  const arrow = (a: number | null, b: number | null) => (a != null && b != null ? `${b >= a ? "↑" : "↓"} ${f(a)} → ${f(b)}` : "—");
  const pse = startEnd(pressureSeries);
  const hse = startEnd(humiditySeries);
  const tse = startEnd(tempSeries);

  /* pressure card state */
  const drop = result.pressureDrop3h;
  const pressureTriggered = drop !== null && drop >= settings.pressureDropHpa;
  const pressureBadge =
    drop === null
      ? { text: "Collecting data", cls: "bg-slate-100 text-slate-700" }
      : pressureTriggered
        ? { text: "● Falling fast", cls: "bg-amber-100 border border-amber-200 text-amber-800" }
        : drop >= 0.5
          ? { text: "Falling", cls: "bg-amber-50 border border-amber-200 text-amber-800" }
          : drop <= -0.5
            ? { text: "Rising", cls: "bg-teal-50 border border-teal-200 text-teal-800" }
            : { text: "Steady", cls: "bg-slate-100 text-slate-700" };

  const humidityHigh = humidityNow !== null && humidityNow >= settings.humidityPct;
  const hRise = result.humidityRise1h;
  const tChange = result.tempChange3h;

  const rainingNodes = result.nodesRaining;
  const onlineCount = onlineViews.length;

  /* alert banner */
  const bannerMessage =
    result.level === "raining"
      ? `Rain sensor is wet on ${rainingNodes} of ${result.nodesOnline} online node${result.nodesOnline === 1 ? "" : "s"}.`
      : `Pressure is falling ${f(drop)} hPa per 3 hours with humidity at ${f(humidityNow, 0)}%. ${result.nodesFlagged} of ${result.nodesAssessed} node${result.nodesAssessed === 1 ? "" : "s"} signal rain.`;

  return (
    <main className="w-full bg-slate-50 min-h-screen">
      <AutoRefresh intervalMs={30000} />

      <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {/* WEATHER ALERT */}
        {result.alert && (
          <AlertBanner
            key={result.level}
            title={result.level === "raining" ? "Rain Detected" : "Weather Alert: Rain Likely"}
            badge={`Risk score ${result.score ?? "—"}/100`}
            message={bannerMessage}
            icon={result.level === "raining" ? "rainy" : "thunderstorm"}
          />
        )}

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <MetricCard
            icon={Gauge}
            iconClassName="text-cyan-600"
            title="Air Pressure"
            badge={pressureBadge.text}
            badgeClassName={pressureBadge.cls}
            value={f(pressureNow)}
            unit="hPa"
            description={drop === null ? "Needs ~45 min of history for a trend" : `${drop >= 0 ? "↓" : "↑"} ${f(Math.abs(drop))} hPa per 3 hours`}
            descriptionClassName={pressureTriggered ? "text-amber-700" : "text-slate-600"}
            footer={
              <>
                <span>
                  Alert at: <strong className="text-slate-800">≥ {f(settings.pressureDropHpa)} hPa / 3 h</strong>
                </span>
                <span className={pressureTriggered ? "text-amber-700 font-bold" : "text-slate-500 font-medium"}>{pressureTriggered ? "Triggered" : "Normal"}</span>
              </>
            }
          />

          <MetricCard
            icon={Droplets}
            iconClassName="text-teal-600"
            title="Air Humidity"
            badge={humidityHigh ? "High Moisture" : "Normal"}
            badgeClassName={humidityHigh ? "bg-teal-50 border border-teal-200 text-teal-800" : "bg-slate-100 text-slate-700"}
            value={humidityNow === null ? "—" : `${f(humidityNow)}%`}
            description={hRise === null ? "Needs ~20 min of history" : `${hRise >= 0 ? "↑" : "↓"} ${f(Math.abs(hRise))}% in last hour`}
            descriptionClassName={hRise !== null && hRise >= 5 ? "text-teal-700" : "text-slate-600"}
            footer={
              <>
                <span>
                  Dew point: <strong className="text-slate-800">{dew === null ? "—" : `${f(dew)}°C`}</strong>
                </span>
                {dew !== null && tempNow !== null && (
                  <span className={tempNow - dew < 2 ? "text-teal-700 font-medium" : "text-slate-500 font-medium"}>{tempNow - dew < 2 ? "Condensing" : "Not saturated"}</span>
                )}
              </>
            }
          />

          <MetricCard
            icon={Thermometer}
            iconClassName="text-amber-600"
            title="Temperature"
            badge={tChange === null ? "Collecting data" : tChange <= -1 ? "Cooling" : tChange >= 1 ? "Warming" : "Stable"}
            badgeClassName="bg-slate-100 text-slate-700"
            value={tempNow === null ? "—" : `${f(tempNow)}°C`}
            description={tChange === null ? "Needs ~45 min of history" : `${tChange >= 0 ? "↑" : "↓"} ${f(Math.abs(tChange))}°C over 3 hours`}
            descriptionClassName="text-slate-600"
            footer={
              <span>
                24h Range: <strong className="text-slate-800">{tempRange.lo === null ? "—" : `${f(tempRange.lo)}°C – ${f(tempRange.hi)}°C`}</strong>
              </span>
            }
          />

          <MetricCard
            icon={CloudRain}
            iconClassName="text-cyan-600"
            title="Rain Risk"
            badge={level.badge}
            badgeClassName={level.badgeClass}
            value={level.label}
            unit={result.score !== null ? `(${result.score}/100)` : undefined}
            description={result.nodesAssessed > 0 ? `${result.nodesFlagged} of ${result.nodesAssessed} nodes signal rain` : "Waiting for enough pressure history"}
            descriptionClassName="text-slate-600"
            footer={
              <span>
                Rain sensor: <strong className="text-slate-800">{rainingNodes > 0 ? `Wet (${rainingNodes}/${result.nodesOnline} nodes)` : "Dry"}</strong>
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
                    <ChartNoAxesCombined />
                  </span>
                  <h2 className="text-lg font-bold text-slate-900"> Sensor Trends ({cfg.label})</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Per-node averages in {cfg.bin} bins · refreshes every 30 s</p>
              </div>

              <div className="flex items-center bg-slate-100 border border-slate-200 p-0.5 rounded-lg shrink-0 text-xs self-start sm:self-center">
                {(
                  [
                    ["3h", "3h"],
                    ["24h", "24h"],
                    ["7d", "7 days"],
                  ] as const
                ).map(([value, label]) => (
                  <Link
                    key={value}
                    href={value === "3h" ? "/" : `/?range=${value}`}
                    scroll={false}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      range === value ? "bg-white text-cyan-700 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* TREND CARDS */}
            <div className="flex flex-col gap-4 pt-1">
              <TrendCard
                icon={Gauge}
                iconClassName="bg-cyan-50 text-cyan-700"
                title="Air Pressure Trend"
                badge={pressureBadge.text}
                badgeClassName={pressureBadge.cls}
                subtitle={`Alert when pressure falls ≥ ${f(settings.pressureDropHpa)} hPa per 3 hours`}
                current={f(pressureNow)}
                unit="hPa"
                change={arrow(pse?.start ?? null, pse?.end ?? null)}
                changeClassName={pressureTriggered ? "text-amber-700" : "text-slate-600"}
                chart={<TrendChart series={pressureSeries} from={now - cfg.ms} to={now} binMs={cfg.binMs} unit="hPa" decimals={1} />}
              />

              <TrendCard
                icon={Droplets}
                iconClassName="bg-teal-50 text-teal-700"
                title="Air Humidity Trend"
                badge={humidityHigh ? "High Moisture" : "Normal"}
                badgeClassName={humidityHigh ? "bg-teal-50 border border-teal-200 text-teal-800" : "bg-slate-100 text-slate-700"}
                subtitle={`Alert when humidity exceeds ${settings.humidityPct}%`}
                current={f(humidityNow)}
                unit="%"
                change={arrow(hse?.start ?? null, hse?.end ?? null)}
                changeClassName="text-teal-700"
                chart={<TrendChart series={humiditySeries} from={now - cfg.ms} to={now} binMs={cfg.binMs} unit="%" decimals={1} />}
              />

              <TrendCard
                icon={Thermometer}
                iconClassName="bg-amber-100 text-amber-700"
                title="Ambient Temperature Trend"
                badge={tChange === null ? "Collecting data" : tChange <= -1 ? "Cooling" : tChange >= 1 ? "Warming" : "Stable"}
                badgeClassName="bg-slate-100 text-slate-700"
                subtitle="Falling temperature with rising humidity often precedes rain"
                current={f(tempNow)}
                unit="°C"
                change={arrow(tse?.start ?? null, tse?.end ?? null)}
                changeClassName="text-slate-600"
                chart={<TrendChart series={tempSeries} from={now - cfg.ms} to={now} binMs={cfg.binMs} unit="°C" decimals={1} />}
              />
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                  <span className=" text-[18px]"><TrendingDown/></span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pressure Tendency</span>
                  <strong className="text-slate-800 font-bold text-sm">{drop === null ? "Collecting data" : `${drop >= 0 ? "−" : "+"}${f(Math.abs(drop))} hPa / 3 h`}</strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    <Waves />
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Moisture Change</span>
                  <strong className="text-slate-800 font-bold text-sm">{hRise === null ? "Collecting data" : `${hRise >= 0 ? "+" : "−"}${f(Math.abs(hRise))}% in 1 hour`}</strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    <CircleAlert />
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Node Consensus</span>
                  <strong className="text-slate-800 font-bold text-sm">
                    {result.nodesAssessed === 0 ? "Collecting data" : `${result.nodesFlagged} of ${result.nodesAssessed} Nodes Agree`}
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
                    <Network />
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Node Status Overview</h3>
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                    nodeViews.length > 0 && onlineCount === nodeViews.length ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {onlineCount} of {nodeViews.length} Connected
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {nodeViews.map((n) => (
                  <NodeStatusCard
                    key={n.id}
                    name={n.name}
                    location={n.location}
                    color={n.color}
                    online={n.online}
                    status={n.online ? "Online" : n.latest ? `Offline · ${ago(now - n.latest.recordedAt.getTime())}` : "No data"}
                    pressure={n.latest?.pressure != null ? `${f(n.latest.pressure)} hPa` : "—"}
                    temperature={n.latest?.temperature != null ? `${f(n.latest.temperature)}°C` : "—"}
                    humidity={n.latest?.humidity != null ? `${f(n.latest.humidity)}%` : "—"}
                  />
                ))}
                {nodeViews.length === 0 && <p className="text-xs text-slate-400 py-4 text-center">No nodes yet. Start the MQTT worker and power a node.</p>}
              </div>
            </div>

            {/* THRESHOLDS */}
            <ThresholdsPanel initial={settings} currentDrop={drop} currentHumidity={humidityNow} />
          </div>
        </div>
      </div>
    </main>
  );
}
