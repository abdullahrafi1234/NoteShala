import { docsData } from "@/components/docs/loader";
import { OverallStats } from "@/components/docs/OverallStats";
import { useReadingStats } from "@/hooks/useReadingStats";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MissionCard } from "./MissionCard";

export const WelcomePage = () => {
  const { stats } = useReadingStats(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const totalSections = useMemo(
    () => docsData.reduce((sum, cat) => sum + cat.sections.length, 0),
    [],
  );

  return (
    <div className="flex-1 min-w-0 px-6 py-12 max-w-6xl mx-auto">
      <div
        className={[
          "mb-12 text-center transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        ].join(" ")}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xl font-bold mb-5 border border-primary/20 shadow-sm">
          <Sparkles className="h-6 w-6" />
          "Ready to build today?"
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-[#00d4ff]">
            Learn → Build → Ship 🚀
          </span>
        </h1>
        <p className="text-muted-foreground text-lg font-semibold">
          Pick a mission. Build your knowledge.
        </p>
      </div>

      {stats.visitedSections.length > 0 && (
        <div
          className={[
            "transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          ].join(" ")}
          style={{ transitionDelay: "150ms" }}
        >
          <OverallStats stats={stats} totalSections={totalSections} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {docsData.map((category, i) => (
          <MissionCard
            key={category.id}
            category={category}
            themeIndex={i}
            visitedSections={stats.visitedSections}
            lastVisitedId={stats.lastVisited}
            mountDelay={200 + i * 80}
            mounted={mounted}
          />
        ))}
      </div>
    </div>
  );
};
