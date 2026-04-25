import { DocContent } from "@/components/docs/DocContent";
import { docsData } from "@/components/docs/loader";
import { MobileSidebar } from "@/components/docs/MobileSidebar";
import { Sidebar } from "@/components/docs/Sidebar";
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
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

// Each card gets a unique cross-color gradient + icon + accent
const CARD_THEMES = [
  {
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
    Icon: BrainCircuit,
    patternColor: "rgba(139,92,246,0.12)",
  },
  {
    gradient: "from-rose-500 via-pink-500 to-fuchsia-600",
    glow: "shadow-rose-500/25",
    ring: "ring-rose-400/50",
    progressBar: "from-rose-400 to-fuchsia-500",
    pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    accent: "text-rose-600 dark:text-rose-300",
    dot: "bg-rose-400",
    rowHover:
      "bg-rose-50/80 dark:bg-rose-900/20 ring-1 ring-rose-300/40 dark:ring-rose-700/40",
    innerBg: "bg-rose-50/60 dark:bg-rose-950/30",
    Icon: Atom,
    patternColor: "rgba(244,63,94,0.12)",
  },
  {
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glow: "shadow-amber-500/25",
    ring: "ring-amber-400/50",
    progressBar: "from-amber-400 to-orange-500",
    pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    accent: "text-amber-600 dark:text-amber-300",
    dot: "bg-amber-400",
    rowHover:
      "bg-amber-50/80 dark:bg-amber-900/20 ring-1 ring-amber-300/40 dark:ring-amber-700/40",
    innerBg: "bg-amber-50/60 dark:bg-amber-950/30",
    Icon: Rocket,
    patternColor: "rgba(251,146,60,0.12)",
  },
  {
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    glow: "shadow-emerald-500/25",
    ring: "ring-emerald-400/50",
    progressBar: "from-emerald-400 to-cyan-500",
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    accent: "text-emerald-600 dark:text-emerald-300",
    dot: "bg-emerald-400",
    rowHover:
      "bg-emerald-50/80 dark:bg-emerald-900/20 ring-1 ring-emerald-300/40 dark:ring-emerald-700/40",
    innerBg: "bg-emerald-50/60 dark:bg-emerald-950/30",
    Icon: FlaskConical,
    patternColor: "rgba(16,185,129,0.12)",
  },
  {
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    glow: "shadow-sky-500/25",
    ring: "ring-sky-400/50",
    progressBar: "from-sky-400 to-blue-500",
    pill: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    accent: "text-sky-600 dark:text-sky-300",
    dot: "bg-sky-400",
    rowHover:
      "bg-sky-50/80 dark:bg-sky-900/20 ring-1 ring-sky-300/40 dark:ring-sky-700/40",
    innerBg: "bg-sky-50/60 dark:bg-sky-950/30",
    Icon: Globe,
    patternColor: "rgba(14,165,233,0.12)",
  },
  {
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    glow: "shadow-lime-500/25",
    ring: "ring-lime-400/50",
    progressBar: "from-lime-400 to-green-500",
    pill: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
    accent: "text-lime-700 dark:text-lime-300",
    dot: "bg-lime-400",
    rowHover:
      "bg-lime-50/80 dark:bg-lime-900/20 ring-1 ring-lime-300/40 dark:ring-lime-700/40",
    innerBg: "bg-lime-50/60 dark:bg-lime-950/30",
    Icon: TreePine,
    patternColor: "rgba(132,204,22,0.12)",
  },
  {
    gradient: "from-cyan-400 via-teal-500 to-blue-600",
    glow: "shadow-cyan-500/25",
    ring: "ring-cyan-400/50",
    progressBar: "from-cyan-400 to-teal-500",
    pill: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    accent: "text-cyan-600 dark:text-cyan-300",
    dot: "bg-cyan-400",
    rowHover:
      "bg-cyan-50/80 dark:bg-cyan-900/20 ring-1 ring-cyan-300/40 dark:ring-cyan-700/40",
    innerBg: "bg-cyan-50/60 dark:bg-cyan-950/30",
    Icon: Code2,
    patternColor: "rgba(6,182,212,0.12)",
  },
  {
    gradient: "from-fuchsia-500 via-purple-500 to-violet-600",
    glow: "shadow-fuchsia-500/25",
    ring: "ring-fuchsia-400/50",
    progressBar: "from-fuchsia-400 to-violet-500",
    pill: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
    accent: "text-fuchsia-600 dark:text-fuchsia-300",
    dot: "bg-fuchsia-400",
    rowHover:
      "bg-fuchsia-50/80 dark:bg-fuchsia-900/20 ring-1 ring-fuchsia-300/40 dark:ring-fuchsia-700/40",
    innerBg: "bg-fuchsia-50/60 dark:bg-fuchsia-950/30",
    Icon: Sparkles,
    patternColor: "rgba(217,70,239,0.12)",
  },
  {
    gradient: "from-red-500 via-rose-500 to-pink-600",
    glow: "shadow-red-500/25",
    ring: "ring-red-400/50",
    progressBar: "from-red-400 to-pink-500",
    pill: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    accent: "text-red-600 dark:text-red-300",
    dot: "bg-red-400",
    rowHover:
      "bg-red-50/80 dark:bg-red-900/20 ring-1 ring-red-300/40 dark:ring-red-700/40",
    innerBg: "bg-red-50/60 dark:bg-red-950/30",
    Icon: Shield,
    patternColor: "rgba(239,68,68,0.12)",
  },
  {
    gradient: "from-orange-400 via-amber-500 to-yellow-500",
    glow: "shadow-orange-500/25",
    ring: "ring-orange-400/50",
    progressBar: "from-orange-400 to-yellow-500",
    pill: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    accent: "text-orange-600 dark:text-orange-300",
    dot: "bg-orange-400",
    rowHover:
      "bg-orange-50/80 dark:bg-orange-900/20 ring-1 ring-orange-300/40 dark:ring-orange-700/40",
    innerBg: "bg-orange-50/60 dark:bg-orange-950/30",
    Icon: Cpu,
    patternColor: "rgba(249,115,22,0.12)",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTheme(index: number) {
  return CARD_THEMES[index % CARD_THEMES.length];
}

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useReadingStats(currentSectionId?: string) {
  const [stats, setStats] = useState<ReadingStats>(loadStats);

  useEffect(() => {
    if (!currentSectionId) return;
    setStats((prev) => {
      const alreadyVisited = prev.visitedSections.includes(currentSectionId);
      let readingTime = 3;
      let sectionTitle: string | null = null;
      let categoryTitle: string | null = null;

      for (const cat of docsData) {
        const idx = cat.sections.findIndex((s) => s.id === currentSectionId);
        if (idx !== -1) {
          readingTime = estimateReadingTime(cat.sections[idx]);
          sectionTitle = cat.sections[idx].title;
          categoryTitle = cat.title;
          break;
        }
      }

      const updated: ReadingStats = {
        totalMinutes: alreadyVisited
          ? prev.totalMinutes
          : prev.totalMinutes + readingTime,
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
  }, [currentSectionId]);

  return stats;
}

// ─── Total Reading Time Bar ───────────────────────────────────────────────────

function TotalReadingTimeBar({ totalMinutes }: { totalMinutes: number }) {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const label = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  const percent = Math.min(100, (totalMinutes / 300) * 100);

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

  const totalSections = category.sections.length;
  const visitedCount = useMemo(
    () =>
      category.sections.filter((s) => visitedSections.includes(s.id)).length,
    [category.sections, visitedSections],
  );
  const progressPercent =
    totalSections > 0 ? (visitedCount / totalSections) * 100 : 0;
  const isComplete = visitedCount === totalSections && totalSections > 0;

  const totalReadingMins = useMemo(
    () => category.sections.reduce((sum, s) => sum + estimateReadingTime(s), 0),
    [category.sections],
  );
  const readingLabel =
    totalReadingMins >= 60
      ? `${Math.floor(totalReadingMins / 60)}h ${totalReadingMins % 60}m`
      : `${totalReadingMins} min`;

  const lastReadSection = useMemo(
    () =>
      lastVisitedId
        ? (category.sections.find((s) => s.id === lastVisitedId) ?? null)
        : null,
    [category.sections, lastVisitedId],
  );
  const isActiveCategory = lastReadSection !== null;

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
        {/* Radial background glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 60% 20%, ${theme.patternColor} 0%, transparent 65%)`,
          }}
        />

        {/* Top gradient strip */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient} flex-shrink-0`}
        />

        {/* Body */}
        <div className="relative flex flex-col flex-1 p-5 gap-5">
          {/* ── Icon block (centered, large) */}
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
              {isComplete && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-md border-2 border-background">
                  <Trophy
                    className="h-3 w-3 text-yellow-900"
                    strokeWidth={2.5}
                  />
                </div>
              )}
              {isActiveCategory && !isComplete && (
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

            {/* Title — big */}
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:[background:linear-gradient(135deg,_var(--tw-gradient-stops))] transition-all duration-300 px-1">
                {category.title}
              </h2>

              {/* Meta pills row */}
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

          {/* ── Section list */}
          <div className="space-y-1.5">
            {category.sections.slice(0, 4).map((section) => {
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
            {totalSections > 4 && (
              <p className={`text-xs font-bold pl-8 py-1 ${theme.accent}`}>
                +{totalSections - 4} more
              </p>
            )}
          </div>

          {/* ── Progress + Last Read block */}
          <div className={`rounded-2xl p-4 ${theme.innerBg} space-y-3 mt-auto`}>
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {isComplete ? "Complete!" : "Progress"}
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

            {/* Last read */}
            {lastReadSection ? (
              <div className="pt-2.5 border-t border-border/30">
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1.5">
                  Last read
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${theme.dot}`}
                  />
                  <p className={`text-xs font-bold truncate ${theme.accent}`}>
                    {lastReadSection.title}
                  </p>
                </div>
              </div>
            ) : (
              <div className="pt-2.5 border-t border-border/30">
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">
                  Last read
                </p>
                <p className="text-xs text-muted-foreground/60 font-medium italic">
                  Not started yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Corner arrow */}
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
  const hours = Math.floor(stats.totalMinutes / 60);
  const mins = stats.totalMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${stats.totalMinutes}m`;

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
                {timeLabel}
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

// ─── Welcome Page ─────────────────────────────────────────────────────────────

const WelcomePage = () => {
  const stats = useReadingStats(undefined);
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
      {/* Hero */}
      <div
        className={[
          "mb-12 text-center transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        ].join(" ")}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xl font-bold mb-5 border border-primary/20 shadow-sm">
          <Sparkles className="h-6 w-6" />
          “Ready to build today?”
        </div>
        <h1 className="text-4xl sm:text-4xl font-black mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-[#00d4ff]">
            Learn → Build → Ship 🚀
          </span>
          {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-sky-400 to-indigo-400">
            Learn → Build → Ship 🚀
          </span> */}
        </h1>
        <p className="text-muted-foreground text-lg font-semibold">
          Pick a mission. Build your knowledge.
        </p>
      </div>

      {/* Stats */}
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

      {/* Cards */}
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
  const stats = useReadingStats(sectionId);

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
        <div className="flex-1 min-w-0">
          <div className="lg:hidden p-4 border-b border-border">
            <MobileSidebar />
          </div>

          {sectionId && (
            <TotalReadingTimeBar totalMinutes={stats.totalMinutes} />
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
      </div>
    </div>
  );
};

export default Docs;
