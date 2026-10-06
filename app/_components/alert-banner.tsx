"use client";

import { useState } from "react";

type Props = {
  title: string;
  badge: string;
  message: string;
  icon?: string;
};

export default function AlertBanner({ title, badge, message, icon = "thunderstorm" }: Props) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-amber-50 border border-amber-200 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-amber-900">{title}</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-200/80 text-amber-900">
              {badge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
        <a
          href="#thresholds"
          className="h-8 px-3 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors shadow-sm flex items-center"
        >
          View Thresholds
        </a>
        <button
          className="h-8 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm"
          onClick={() => setVisible(false)}
          type="button"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
}
