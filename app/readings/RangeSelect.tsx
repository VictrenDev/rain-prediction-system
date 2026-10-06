"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RangeSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <select
      value={value}
      onChange={(e) => {
        const p = new URLSearchParams(params.toString());
        p.set("range", e.target.value);
        p.delete("page");
        router.push(`${pathname}?${p.toString()}`);
      }}
      className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none focus:border-cyan-600"
    >
      <option value="24h">Last 24 hours</option>
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
    </select>
  );
}
