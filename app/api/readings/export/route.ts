import type { NextRequest } from "next/server";
import { getReadings, parseRange } from "../../../../lib/db/queries";

export const dynamic = "force-dynamic";

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const range = parseRange(sp.get("range") ?? undefined);
  const nodeId = sp.get("node") ?? undefined;

  const rows = await getReadings({ nodeId, range, limit: 50000 });

  const header = [
    "recorded_at",
    "node_id",
    "node_name",
    "temperature_c",
    "humidity_pct",
    "pressure_hpa",
    "rain_raw",
    "is_raining",
  ];

  const lines = rows.map((r) =>
    [
      r.recordedAt.toISOString(),
      csvCell(r.nodeId),
      csvCell(r.nodeName),
      r.temperature ?? "",
      r.humidity ?? "",
      r.pressure ?? "",
      r.rainRaw ?? "",
      r.isRaining,
    ].join(",")
  );

  return new Response([header.join(","), ...lines].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="readings-${range}.csv"`,
    },
  });
}
