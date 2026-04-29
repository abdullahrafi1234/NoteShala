import { BackToTop } from "@/components/docs/BackToTop";
import { Breadcrumb } from "@/components/docs/Breadcrumb";
import { DocContent } from "@/components/docs/DocContent";
import { docsData, getSectionById } from "@/components/docs/loader";
import { MobileSidebar } from "@/components/docs/MobileSidebar";
import { Sidebar } from "@/components/docs/Sidebar";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { Navbar } from "@/components/layout/Navbar";
import {
  ArrowRight,
  Atom,
  BarChart2,
  BrainCircuit,
  Clock,
  Code2,
  Cpu,
  FlaskConical,
  Globe,
  Rocket,
  Shield,
  Sparkles,
  TreePine,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReadingStats {
  totalMinutes: number;
  visitedSections: string[];
  lastVisited: string | null;
  lastVisitedTitle: string | null;
  lastVisitedCategory: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "noteshala_reading_stats_v2";
const WORDS_PER_MINUTE = 200;

const ICONS = [
  BrainCircuit,
  Atom,
  Rocket,
  FlaskConical,
  Globe,
  TreePine,
  Code2,
  Sparkles,
  Shield,
  Cpu,
];

const CARD_THEME = {
  gradient: "from-violet-500 via-purple-500 to-indigo-600",
  glow: "shadow-violet-500/25",
  ring: "ring-violet-400/50",
  progressBar: "from-violet-400 to-indigo-500",
  pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  accent: "text-violet-600 dark:text-violet-300",
  dot: "bg-violet-400",
  rowHover:
    "bg-violet-50/80 dark:bg-violet-900/20 ring-1 ring-violet-300/40 dark:ring-violet-700/40",
  innerBg: "bg-violet-50/60 dark:bg-violet-950/30",
  patternColor: "rgba(139,92,246,0.12)",
};

function getTheme(index: number) {
  return {
    ...CARD_THEME,
    Icon: ICONS[index % ICONS.length],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function estimateReadingTime(section: {
  title: string;
  content?: string;
}): number {
  const text = section.content ?? section.title.repeat(30);
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

function loadStats(): ReadingStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ReadingStats;
  } catch {
    /* ignore */
  }
  return {
    totalMinutes: 0,
    visitedSections: [],
    lastVisited: null,
    lastVisitedTitle: null,
    lastVisitedCategory: null,
  };
}

function saveStats(stats: ReadingStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}

function formatTime(totalMinutes: number, liveSeconds?: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const secs = liveSeconds !== undefined ? liveSeconds % 60 : null;
  if (hours > 0) {
    return secs !== null ? `${hours}h ${mins}m ${secs}s` : `${hours}h ${mins}m`;
  }
  return secs !== null ? `${mins}m ${secs}s` : `${mins}m`;
}

// ─── useReadingStats ──────────────────────────────────────────────────────────

function useReadingStats(currentSectionId?: string) {
  const [stats, setStats] = useState<ReadingStats>(loadStats);
  const startTimeRef = useRef<number>(Date.now());
  const pausedRef = useRef<number>(0);
  const hiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!currentSectionId) return;

    setStats((prev) => {
      let sectionTitle: string | null = null;
      let categoryTitle: string | null = null;
      for (const cat of docsData) {
        const idx = cat.sections.findIndex((s) => s.id === currentSectionId);
        if (idx !== -1) {
          sectionTitle = cat.sections[idx].title;
          categoryTitle = cat.title;
          break;
        }
      }
      const alreadyVisited = prev.visitedSections.includes(currentSectionId);
      const updated: ReadingStats = {
        ...prev,
        visitedSections: alreadyVisited
          ? prev.visitedSections
          : [...prev.visitedSections, currentSectionId],
        lastVisited: currentSectionId,
        lastVisitedTitle: sectionTitle,
        lastVisitedCategory: categoryTitle,
      };
      saveStats(updated);
      return updated;
    });

    startTimeRef.current = Date.now();
    pausedRef.current = 0;
    hiddenAtRef.current = null;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
      } else {
        if (hiddenAtRef.current) {
          pausedRef.current += Date.now() - hiddenAtRef.current;
          hiddenAtRef.current = null;
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      const activeMs = Date.now() - startTimeRef.current - pausedRef.current;
      const activeMinutes = Math.floor(activeMs / 60000);
      if (activeMinutes >= 1) {
        setStats((prev) => {
          const updated = {
            ...prev,
            totalMinutes: prev.totalMinutes + activeMinutes,
          };
          saveStats(updated);
          return updated;
        });
      }
    };
  }, [currentSectionId]);

  return { stats, startTimeRef, pausedRef };
}

// ─── LiveTimer — isolated component ──────────────────────────────────────────

function LiveTimer({
  startTimeRef,
  pausedRef,
  savedMinutes,
}: {
  startTimeRef: React.MutableRefObject<number>;
  pausedRef: React.MutableRefObject<number>;
  savedMinutes: number;
}) {
  const [liveSeconds, setLiveSeconds] = useState(0);

  useEffect(() => {
    setLiveSeconds(0);
    const interval = setInterval(() => {
      if (!document.hidden) {
        const activeMs = Date.now() - startTimeRef.current - pausedRef.current;
        setLiveSeconds(Math.floor(activeMs / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTimeRef, pausedRef]);

  const totalSeconds = savedMinutes * 60 + liveSeconds;
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const label = hours > 0 ? `${hours}h ${mins}m ${secs}s` : `${mins}m ${secs}s`;
  const percent = Math.min(100, (savedMinutes / 300) * 100);

  return (
    <div className="px-5 py-3 border-b border-border/60 bg-gradient-to-r from-muted/50 via-background to-muted/30">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
          <Clock className="h-3.5 w-3.5 text-primary" />
          Total reading time
        </div>
        <span className="text-xs font-extrabold text-primary tabular-nums">
          {label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 transition-all duration-1000 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Overall Stats ────────────────────────────────────────────────────────────

function OverallStats({
  stats,
  totalSections,
}: {
  stats: ReadingStats;
  totalSections: number;
}) {
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
}

// ─── Mission Card ─────────────────────────────────────────────────────────────

interface MissionCardProps {
  category: (typeof docsData)[number];
  themeIndex: number;
  visitedSections: string[];
  lastVisitedId: string | null;
  mountDelay: number;
  mounted: boolean;
}

function MissionCard({
  category,
  themeIndex,
  visitedSections,
  lastVisitedId,
  mountDelay,
  mounted,
}: MissionCardProps) {
  const theme = getTheme(themeIndex);
  const { Icon } = theme;
  const [showAll, setShowAll] = useState(false);

  const totalSections = category.sections.length;
  const visitedCount = useMemo(
    () =>
      category.sections.filter((s) => visitedSections.includes(s.id)).length,
    [category.sections, visitedSections],
  );
  const progressPercent =
    totalSections > 0 ? (visitedCount / totalSections) * 100 : 0;

  const totalReadingMins = useMemo(
    () => category.sections.reduce((sum, s) => sum + estimateReadingTime(s), 0),
    [category.sections],
  );
  const readingLabel =
    totalReadingMins >= 60
      ? `${Math.floor(totalReadingMins / 60)}h ${totalReadingMins % 60}m`
      : `${totalReadingMins} min`;

  const isActiveCategory = lastVisitedId
    ? category.sections.some((s) => s.id === lastVisitedId)
    : false;

  const visibleSections = showAll
    ? category.sections
    : category.sections.slice(0, 3);

  return (
    <div
      className={[
        "transition-all duration-700",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      ].join(" ")}
      style={{ transitionDelay: `${mountDelay}ms` }}
    >
      <Link
        to={`/docs/${category.sections[0]?.id}`}
        className={[
          "group relative flex flex-col overflow-hidden rounded-2xl border",
          "transition-all duration-400 ease-out",
          "hover:-translate-y-2 hover:scale-[1.015]",
          isActiveCategory
            ? `border-transparent ring-2 ${theme.ring} shadow-2xl ${theme.glow}`
            : `border-border/60 hover:border-transparent hover:ring-1 hover:${theme.ring} hover:shadow-xl hover:${theme.glow}`,
        ].join(" ")}
        style={{ background: "hsl(var(--card))" }}
      >
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 60% 20%, ${theme.patternColor} 0%, transparent 65%)`,
          }}
        />

        <div
          className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient} flex-shrink-0`}
        />

        <div className="relative flex flex-col flex-1 p-5 gap-5">
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className={[
                "relative w-16 h-16 rounded-2xl flex items-center justify-center",
                `bg-gradient-to-br ${theme.gradient}`,
                `shadow-lg ${theme.glow}`,
                "transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]",
              ].join(" ")}
            >
              <Icon
                className="h-8 w-8 text-white drop-shadow-md"
                strokeWidth={1.7}
              />
              {isActiveCategory && (
                <div
                  className={[
                    "absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center",
                    `bg-gradient-to-br ${theme.gradient}`,
                  ].join(" ")}
                >
                  <Zap className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground leading-snug px-1">
                {category.title}
              </h2>
              <div className="flex items-center gap-2 mt-2.5 justify-center flex-wrap">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${theme.pill}`}
                >
                  {totalSections} topics
                </span>
                <span
                  className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${theme.pill}`}
                >
                  <Clock className="h-3 w-3" />
                  {readingLabel}
                </span>
                {isActiveCategory && (
                  <span
                    className={`flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${theme.gradient} shadow-sm`}
                  >
                    <Zap className="h-3 w-3" />
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 min-h-[9.5rem]">
            {visibleSections.map((section) => {
              const visited = visitedSections.includes(section.id);
              const isLast = section.id === lastVisitedId;
              return (
                <div
                  key={section.id}
                  className={[
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200",
                    isLast
                      ? theme.rowHover
                      : visited
                        ? "bg-muted/50"
                        : "hover:bg-muted/25",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-2 w-2 rounded-full shrink-0 transition-all duration-300",
                      visited ? `${theme.dot} shadow-sm` : "bg-border",
                    ].join(" ")}
                  />
                  <p
                    className={[
                      "text-sm font-semibold truncate flex-1",
                      isLast
                        ? theme.accent
                        : visited
                          ? "text-foreground/70"
                          : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {section.title}
                  </p>
                  {isLast && (
                    <Zap className={`h-3.5 w-3.5 shrink-0 ${theme.accent}`} />
                  )}
                </div>
              );
            })}

            <div className="h-7 flex items-center">
              {category.sections.length > 3 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAll((prev) => !prev);
                  }}
                  className={`text-xs font-bold pl-3 ${theme.accent} hover:underline`}
                >
                  {showAll
                    ? "Show less ↑"
                    : `+${category.sections.length - 3} more ↓`}
                </button>
              )}
            </div>
          </div>

          <div className={`rounded-2xl p-4 ${theme.innerBg} mt-auto`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Progress
              </span>
              <span
                className={`text-xs font-extrabold tabular-nums ${theme.accent}`}
              >
                {visitedCount}/{totalSections}
              </span>
            </div>
            <div className="h-2.5 w-full bg-background/70 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${theme.progressBar} relative overflow-hidden transition-all duration-1000 ease-out`}
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <div
            className={`p-1.5 rounded-full bg-gradient-to-br ${theme.gradient} shadow-md`}
          >
            <ArrowRight className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Welcome Page ─────────────────────────────────────────────────────────────

const WelcomePage = () => {
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

// ─── Docs Page ────────────────────────────────────────────────────────────────

const Docs = () => {
  const { sectionId } = useParams();
  const { stats, startTimeRef, pausedRef } = useReadingStats(sectionId);

  const currentSection = useMemo(() => {
    if (!sectionId) return null;
    const section = getSectionById(sectionId);
    console.log("content length:", section?.content?.length); // ← যোগ করুন
    return section;
  }, [sectionId]);

  const currentSectionMeta = useMemo(() => {
    if (!sectionId) return null;
    for (let i = 0; i < docsData.length; i++) {
      const cat = docsData[i];
      const idx = cat.sections.findIndex((s) => s.id === sectionId);
      if (idx !== -1) {
        return {
          readingTime: estimateReadingTime(cat.sections[idx]),
          theme: getTheme(i),
        };
      }
    }
    return null;
  }, [sectionId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <div className="flex-1 min-w-0 flex">
          <div className="flex-1 min-w-0">
            <div className="lg:hidden p-4 border-b border-border">
              <MobileSidebar />
            </div>

            {sectionId && <Breadcrumb sectionId={sectionId} />}

            {sectionId && (
              <LiveTimer
                startTimeRef={startTimeRef}
                pausedRef={pausedRef}
                savedMinutes={stats.totalMinutes}
              />
            )}

            {sectionId && currentSectionMeta && (
              <div className="flex items-center gap-2.5 px-5 py-2.5 border-b border-border/50 bg-muted/10 flex-wrap">
                <span
                  className={[
                    "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-sm",
                    `bg-gradient-to-r ${currentSectionMeta.theme.gradient}`,
                  ].join(" ")}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {currentSectionMeta.readingTime} min read
                </span>
                {stats.lastVisited === sectionId && (
                  <span
                    className={[
                      "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full",
                      currentSectionMeta.theme.pill,
                    ].join(" ")}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Currently reading
                  </span>
                )}
              </div>
            )}

            {sectionId ? <DocContent /> : <WelcomePage />}
          </div>

          {sectionId && currentSection && (
            <div className="hidden xl:flex w-64 shrink-0 border-l border-border/50">
              <TableOfContents content={currentSection.content} />
            </div>
          )}
        </div>
      </div>
      <BackToTop></BackToTop>
    </div>
  );
};

export default Docs;
