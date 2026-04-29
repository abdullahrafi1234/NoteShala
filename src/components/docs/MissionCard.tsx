import { docsData } from "@/components/docs/loader";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getTheme } from "./cardTheme";

interface MissionCardProps {
  category: (typeof docsData)[number];
  themeIndex: number;
  visitedSections: string[];
  lastVisitedId: string | null;
  mountDelay: number;
  mounted: boolean;
}

// Site base color themes — cyan / teal / sky family only
const SITE_THEMES = [
  {
    gradient: "from-cyan-500 to-teal-600",
    glow: "shadow-cyan-500/20",
    ring: "ring-cyan-400/40",
    accent: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-400",
    rowHover:
      "bg-cyan-50/80 dark:bg-cyan-900/20 ring-1 ring-cyan-200/60 dark:ring-cyan-800/40",
    innerBg: "bg-cyan-50/60 dark:bg-cyan-950/30",
    patternColor: "rgba(6,182,212,0.10)",
  },
  {
    gradient: "from-teal-500 to-cyan-600",
    glow: "shadow-teal-500/20",
    ring: "ring-teal-400/40",
    accent: "text-teal-600 dark:text-teal-400",
    dot: "bg-teal-400",
    rowHover:
      "bg-teal-50/80 dark:bg-teal-900/20 ring-1 ring-teal-200/60 dark:ring-teal-800/40",
    innerBg: "bg-teal-50/60 dark:bg-teal-950/30",
    patternColor: "rgba(20,184,166,0.10)",
  },
  {
    gradient: "from-sky-500 to-cyan-500",
    glow: "shadow-sky-500/20",
    ring: "ring-sky-400/40",
    accent: "text-sky-600 dark:text-sky-400",
    dot: "bg-sky-400",
    rowHover:
      "bg-sky-50/80 dark:bg-sky-900/20 ring-1 ring-sky-200/60 dark:ring-sky-800/40",
    innerBg: "bg-sky-50/60 dark:bg-sky-950/30",
    patternColor: "rgba(14,165,233,0.10)",
  },
  {
    gradient: "from-cyan-400 to-sky-600",
    glow: "shadow-cyan-400/20",
    ring: "ring-cyan-300/40",
    accent: "text-cyan-500 dark:text-cyan-400",
    dot: "bg-cyan-300",
    rowHover:
      "bg-cyan-50/80 dark:bg-cyan-900/20 ring-1 ring-cyan-200/60 dark:ring-cyan-800/40",
    innerBg: "bg-cyan-50/60 dark:bg-cyan-950/30",
    patternColor: "rgba(34,211,238,0.10)",
  },
  {
    gradient: "from-teal-400 to-sky-500",
    glow: "shadow-teal-400/20",
    ring: "ring-teal-300/40",
    accent: "text-teal-500 dark:text-teal-400",
    dot: "bg-teal-300",
    rowHover:
      "bg-teal-50/80 dark:bg-teal-900/20 ring-1 ring-teal-200/60 dark:ring-teal-800/40",
    innerBg: "bg-teal-50/60 dark:bg-teal-950/30",
    patternColor: "rgba(45,212,191,0.10)",
  },
  {
    gradient: "from-sky-400 to-teal-500",
    glow: "shadow-sky-400/20",
    ring: "ring-sky-300/40",
    accent: "text-sky-500 dark:text-sky-400",
    dot: "bg-sky-300",
    rowHover:
      "bg-sky-50/80 dark:bg-sky-900/20 ring-1 ring-sky-200/60 dark:ring-sky-800/40",
    innerBg: "bg-sky-50/60 dark:bg-sky-950/30",
    patternColor: "rgba(56,189,248,0.10)",
  },
];

function getSiteTheme(index: number) {
  return SITE_THEMES[index % SITE_THEMES.length];
}

export const MissionCard = ({
  category,
  themeIndex,
  visitedSections,
  lastVisitedId,
  mountDelay,
  mounted,
}: MissionCardProps) => {
  const ct = getSiteTheme(themeIndex);
  const { Icon } = getTheme(themeIndex); // unique icon per card
  const [showAll, setShowAll] = useState(false);

  const totalSections = category.sections.length;
  const visibleSections = showAll
    ? category.sections
    : category.sections.slice(0, 3);
  const hiddenCount = totalSections - 3;

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
          "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60",
          "w-full",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-2 hover:scale-[1.015]",
          `hover:border-transparent hover:ring-1 hover:${ct.ring} hover:shadow-xl hover:${ct.glow}`,
        ].join(" ")}
        style={{ background: "hsl(var(--card))" }}
      >
        {/* Hover radial glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 60% 20%, ${ct.patternColor} 0%, transparent 65%)`,
          }}
        />

        {/* Top gradient strip */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${ct.gradient} shrink-0`}
        />

        {/* Body */}
        <div className="relative flex flex-col p-5 gap-4">
          {/* Icon + Title */}
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className={[
                "w-14 h-14 rounded-2xl flex items-center justify-center",
                `bg-gradient-to-br ${ct.gradient} shadow-lg ${ct.glow}`,
                "transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]",
              ].join(" ")}
            >
              <Icon
                className="h-7 w-7 text-white drop-shadow-md"
                strokeWidth={1.7}
              />
            </div>

            <h2 className="text-lg font-extrabold tracking-tight text-foreground leading-snug px-1">
              {category.title}
            </h2>
          </div>

          {/* 3 sections (+ expanded) */}
          <div className="space-y-1">
            {visibleSections.map((section) => {
              const visited = visitedSections.includes(section.id);
              const isLast = section.id === lastVisitedId;
              return (
                <div
                  key={section.id}
                  className={[
                    "flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200",
                    isLast
                      ? ct.rowHover
                      : visited
                        ? "bg-muted/50"
                        : "hover:bg-muted/25",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full shrink-0 transition-colors duration-300",
                      visited ? ct.dot : "bg-border",
                    ].join(" ")}
                  />
                  <p
                    className={[
                      "text-sm font-medium truncate flex-1",
                      isLast
                        ? ct.accent
                        : visited
                          ? "text-foreground/70"
                          : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {section.title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* See more / See less toggle */}
          {hiddenCount > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowAll((prev) => !prev);
              }}
              className={[
                "flex items-center gap-1.5 self-start text-xs font-bold",
                "px-3 py-1.5 rounded-xl transition-all duration-200 hover:opacity-75",
                ct.accent,
                ct.innerBg,
              ].join(" ")}
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  See less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  {hiddenCount} more
                </>
              )}
            </button>
          )}
        </div>

        {/* Corner arrow on hover */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <div
            className={`p-1.5 rounded-full bg-gradient-to-br ${ct.gradient} shadow-md`}
          >
            <ArrowRight className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
      </Link>
    </div>
  );
};
