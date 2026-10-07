"use client";

import useSWR from "swr";
import type { NodesData } from "@/lib/nodes-data";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Request failed");
    return r.json() as Promise<NodesData>;
  });

export function useNodesData() {
  return useSWR<NodesData>("/api/nodes", fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: true,
  });
}
