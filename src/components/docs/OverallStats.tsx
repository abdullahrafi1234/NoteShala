import { BarChart2 } from "lucide-react";
import { ReadingStats } from "../../hooks/useReadingStats";

function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

interface OverallStatsProps {
  stats: ReadingStats;
  totalSections: number;
}

export const OverallStats = ({ stats, totalSections }: OverallStatsProps) => {
  const percent =
    totalSections > 0
      ? Math.min(
          100,
          Math.round((stats.visitedSections.length / totalSections) * 100),
        )
      : 0;
  const label = formatTime(stats.totalMinutes);

  return (
    <div className="mb-10 rounded-2xl border border-border/60 overflow-hidden shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400" />
      <div className="p-5 bg-card">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-foreground">Your Progress</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {stats.visitedSections.length} of {totalSections} sections read
              </p>
            </div>
          </div>
          <div className="flex items-center gap-8 text-center">
            <div>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 tabular-nums">
                {percent}%
              </p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                Complete
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-foreground tabular-nums">
                {label}
              </p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                Read
              </p>
            </div>
          </div>
        </div>
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${percent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
