import { BackToTop } from "@/components/docs/BackToTop";
import { Breadcrumb } from "@/components/docs/Breadcrumb";
import { DocContent } from "@/components/docs/DocContent";
import { LiveTimer } from "@/components/docs/LiveTimer";
import { MobileSidebar } from "@/components/docs/MobileSidebar";
import { Sidebar } from "@/components/docs/Sidebar";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { WelcomePage } from "@/components/docs/WelcomePage";
import { getTheme } from "@/components/docs/cardTheme";
import { docsData, getSectionById } from "@/components/docs/loader";
import { Navbar } from "@/components/layout/Navbar";
import { useReadingStats } from "@/hooks/useReadingStats";
import { Clock, Zap } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

function estimateReadingTime(section: {
  title: string;
  content?: string;
}): number {
  const text = section.content ?? section.title.repeat(30);
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 200));
}

const Docs = () => {
  const { sectionId } = useParams();
  const { stats, startTimeRef, pausedRef } = useReadingStats(sectionId);

  const currentSection = useMemo(() => {
    if (!sectionId) return null;
    return getSectionById(sectionId);
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
      <BackToTop />
    </div>
  );
};

export default Docs;
