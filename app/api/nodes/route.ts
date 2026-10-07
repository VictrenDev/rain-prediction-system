import { NextResponse } from "next/server";
import { getNodesData } from "@/lib/nodes-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getNodesData());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load nodes data" }, { status: 500 });
  }
}
