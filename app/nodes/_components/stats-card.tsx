import { StatCardProps } from "@/lib/types/nodes";

export default function StatCard({ icon, iconClassName = "text-cyan-700", title, badge, value, description, footer, hoverClassName = "hover:border-cyan-600/40" }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between transition-colors ${hoverClassName}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[20px] ${iconClassName}`}>{icon}</span>

          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        </div>
        {badge}
      </div>

      <div className="my-3">
        <div className="flex items-baseline gap-1.5">{value}</div>

        <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">{description}</p>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">{footer}</div>
    </div>
  );
}
