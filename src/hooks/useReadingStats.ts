import { docsData } from "@/components/docs/loader";
import { useEffect, useRef, useState } from "react";

export interface ReadingStats {
  totalMinutes: number;
  visitedSections: string[];
  lastVisited: string | null;
  lastVisitedTitle: string | null;
  lastVisitedCategory: string | null;
}

const STORAGE_KEY = "noteshala_reading_stats_v2";

export function loadStats(): ReadingStats {
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

export function saveStats(stats: ReadingStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}

export function useReadingStats(currentSectionId?: string) {
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
