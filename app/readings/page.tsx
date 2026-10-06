import Link from "next/link";
import {
  PAGE_SIZE,
  countReadings,
  getNodes,
  getReadings,
  parseRange,
  type RangeKey,
} from "../../lib/db/queries";
import RangeSelect from "./RangeSelect";

export const dynamic = "force-dynamic";

function formatTime(d: Date) {
  // "2026-10-06 14:03:22" in Port Harcourt time
  return d.toLocaleString("sv-SE", { timeZone: "Africa/Lagos" });
}

function fmt(n: number | null, digits = 1) {
  return n == null ? "—" : n.toFixed(digits);
}

function href(node: string | undefined, range: RangeKey, page = 1) {
  const p = new URLSearchParams();
  if (node) p.set("node", node);
  p.set("range", range);
  if (page > 1) p.set("page", String(page));
  return `/readings?${p.toString()}`;
}

function RainBadge({ isRaining }: { isRaining: boolean }) {
  if (isRaining) {
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

function PageLink({
  to,
  disabled,
  children,
}: {
  to: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold flex items-center transition-colors";
  if (disabled) {
    return <span className={`${cls} opacity-40 cursor-not-allowed`}>{children}</span>;
  }
  return (
    <Link href={to} className={`${cls} hover:bg-slate-50`}>
      {children}
    </Link>
  );
}

export default async function ReadingsHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ node?: string; range?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const range = parseRange(sp.range);

  const nodes = await getNodes();
  const nodeId = nodes.some((n) => n.id === sp.node) ? sp.node : undefined;

  const total = await countReadings({ nodeId, range });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1),
    totalPages
  );

  const readings = await getReadings({
    nodeId,
    range,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = (page - 1) * PAGE_SIZE + readings.length;

  const exportParams = new URLSearchParams();
  if (nodeId) exportParams.set("node", nodeId);
  exportParams.set("range", range);

  const tabClass = (active: boolean) =>
    `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "bg-cyan-700 text-white shadow-xs"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`;

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
          <Link href={href(undefined, range)} className={tabClass(!nodeId)}>
            All Nodes
          </Link>
          {nodes.map((n) => (
            <Link
              key={n.id}
              href={href(n.id, range)}
              className={tabClass(nodeId === n.id)}
            >
              {n.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <RangeSelect value={range} />

          <a
            href={`/api/readings/export?${exportParams.toString()}`}
            className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            Export CSV
          </a>
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
              {readings.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {formatTime(r.recordedAt)}
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.nodeName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {fmt(r.temperature)}°C
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {fmt(r.humidity)}%
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {fmt(r.pressure)} hPa
                  </td>
                  <td className="py-3 px-4">
                    <RainBadge isRaining={r.isRaining} />
                  </td>
                </tr>
              ))}
              {readings.length === 0 && (
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
          {readings.map((r) => (
            <div key={r.id} className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  {formatTime(r.recordedAt)}
                </span>
                <RainBadge isRaining={r.isRaining} />
              </div>
              <span className="text-xs text-slate-500">{r.nodeName}</span>
              <div className="grid grid-cols-3 gap-2 mt-1 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Temp</span>
                  <span className="font-semibold text-slate-900">{fmt(r.temperature)}°C</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Humidity</span>
                  <span className="font-semibold text-slate-900">{fmt(r.humidity)}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Pressure</span>
                  <span className="font-semibold text-slate-900">{fmt(r.pressure)} hPa</span>
                </div>
              </div>
            </div>
          ))}
          {readings.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No readings for this selection.
            </div>
          )}
        </div>

        {/* Footer with pagination */}
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing{" "}
            <strong className="text-slate-700">
              {from}–{to}
            </strong>{" "}
            of <strong className="text-slate-700">{total}</strong> readings
          </span>

          <div className="flex items-center gap-2">
            <PageLink to={href(nodeId, range, page - 1)} disabled={page <= 1}>
              ← Prev
            </PageLink>
            <span className="px-1">
              Page <strong className="text-slate-700">{page}</strong> of{" "}
              <strong className="text-slate-700">{totalPages}</strong>
            </span>
            <PageLink to={href(nodeId, range, page + 1)} disabled={page >= totalPages}>
              Next →
            </PageLink>
          </div>
        </div>
      </div>
    </div>
  );
}
