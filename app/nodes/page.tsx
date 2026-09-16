import StatusSection from "./_components/status-section";
import NodesTable from "./_components/nodes-table";

export default function NodesPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full text-slate-900">
      {/* 4 METRIC STAT CARDS */}
      <StatusSection />
      {/* NODES TABLE / CARD LIST */}
      <NodesTable />
    </div>
  );
}
