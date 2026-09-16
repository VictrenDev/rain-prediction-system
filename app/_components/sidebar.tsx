"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: "dashboard" },
  { label: "Nodes & Sensors", href: "/nodes", icon: "hub" },
  { label: "Readings History", href: "/readings", icon: "table_chart" },
  { label: "Rain Prediction", href: "/prediction", icon: "rainy" },
  { label: "Alerts & Thresholds", href: "/alerts", icon: "notifications_active" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Listen for the topbar's hamburger toggle
  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-200 z-50 flex flex-col justify-between select-none shadow-sm transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col">
          {/* App Header / Logo */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
                <span className="material-symbols-outlined text-[24px]">water</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-900">
                    HydroMesh
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[11px] font-semibold">
                    v2.4
                  </span>
                </div>
                <span className="text-[12px] text-slate-500 font-medium">
                  Weather &amp; Soil Station
                </span>
              </div>
            </div>
            {/* Close button, mobile only */}
            <button
              className="lg:hidden text-slate-400 hover:text-slate-700"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 pt-5 pb-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Navigation
            </span>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                    active
                      ? "bg-cyan-50 text-cyan-800 font-semibold border-l-4 border-cyan-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      active ? "text-cyan-700" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Info Mini Card */}
        <div className="p-3.5 m-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Prediction Engine
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-cyan-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
              Active
            </span>
          </div>
          <div className="text-xs text-slate-600 flex flex-col gap-1 border-t border-slate-200 pt-2">
            <div className="flex justify-between">
              <span>Model:</span> <strong className="text-slate-800">Rule &amp; Trend Delta</strong>
            </div>
            <div className="flex justify-between">
              <span>Interval:</span> <strong className="text-slate-800">Continuous 3h</strong>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
