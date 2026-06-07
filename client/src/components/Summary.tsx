import type { Table } from "../data/Table";
import { Separator } from "./ui/separator";

interface SummaryProps {
  tables: Table[];
}

const Summary = ({ tables }: SummaryProps) => {
  const getStatsByType = (type: string) => {
    const filtered = tables.filter((t) => t.type === type);
    const count = filtered.length;
    const avgStatus =
      count > 0
        ? filtered.reduce((acc, curr) => acc + curr.status, 0) / count
        : 0;
    return { count, avgStatus: avgStatus.toFixed(1) };
  };

  const stats = {
    foosball: getStatsByType("foosball"),
    snooker: getStatsByType("snooker"),
    airhockey: getStatsByType("air-hockey"),
  };

  return (
    <div className="w-full bg-background border rounded-xl p-4 shadow-sm mb-4">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
        Összesítő
      </h3>

      <div className="flex items-center gap-6 h-12">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{tables.length}</span>
          <span className="text-sm text-muted-foreground">asztal összesen</span>
        </div>

        <Separator orientation="vertical" />

        <div className="flex justify-between gap-2 overflow-x-auto">
          <div className="flex items-center border rounded-md overflow-hidden bg-muted/20">
            <div className="flex items-center gap-2 px-3 py-2 bg-background">
              <div className="w-3 h-3 rounded-full bg-red-700" />
              <span className="text-sm font-semibold">Csocsó</span>
            </div>
            <div className="px-3 py-2 bg-muted/50 border-x text-sm font-medium">
              {stats.foosball.count} db
            </div>
            <div className="px-3 py-2 bg-muted/20 text-sm font-medium italic text-muted-foreground">
              Ø {stats.foosball.avgStatus}
            </div>
          </div>

          <div className="flex items-center border rounded-md overflow-hidden bg-muted/20">
            <div className="flex items-center gap-2 px-3 py-2 bg-background">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-sm font-semibold">Biliárd</span>
            </div>
            <div className="px-3 py-2 bg-muted/50 border-x text-sm font-medium">
              {stats.snooker.count} db
            </div>
            <div className="px-3 py-2 bg-muted/20 text-sm font-medium italic text-muted-foreground">
              Ø {stats.snooker.avgStatus}
            </div>
          </div>

          <div className="flex items-center border rounded-md overflow-hidden bg-muted/20">
            <div className="flex items-center gap-2 px-3 py-2 bg-background">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-sm font-semibold">Léghoki</span>
            </div>
            <div className="px-3 py-2 bg-muted/50 border-x text-sm font-medium">
              {stats.airhockey.count} db
            </div>
            <div className="px-3 py-2 bg-muted/20 text-sm font-medium italic text-muted-foreground">
              Ø {stats.airhockey.avgStatus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;