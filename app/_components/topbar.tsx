"use client";

type TopbarProps = {
  title?: string;
  subtitle?: string;
};

export default function Topbar({
  title = "Rain Prediction",
  subtitle = "Environmental trends and conditions used to predict rainfall",
}: TopbarProps) {
  const toggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Hamburger, mobile only */}
        <button
          className="lg:hidden text-slate-600 hover:text-slate-900 shrink-0"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block truncate">{subtitle}</p>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>

        {/* Station Selector */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Station:</span>
          <div className="relative">
            <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-cyan-600 focus:bg-white cursor-pointer transition-colors shadow-xs">
              <option>All Stations</option>
              <option>Master Hub (Roof Station)</option>
              <option>Node 1 (North Garden)</option>
              <option>Node 2 (South Valley)</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1.5 text-slate-400 text-[16px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-xs text-slate-600">
          <span className="material-symbols-outlined text-[15px] text-cyan-700">schedule</span>
          <span>
            Updated: <strong className="text-slate-800 font-semibold">12:00 PM</strong>
          </span>
        </div>
        <div className="w-8 h-8 rounded-lg bg-cyan-700 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
          JD
        </div>
      </div>
    </header>
  );
}
