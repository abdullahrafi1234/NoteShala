import { getAllSections, getSectionById } from "@/components/docs/loader";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MarkdownRenderer } from "./MarkdownRenderer";

export const DocContent = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const allSections = getAllSections();
  const section = sectionId ? getSectionById(sectionId) : allSections[0];

  const currentIndex = section
    ? allSections.findIndex((s) => s.id === section.id)
    : 0;

  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < allSections.length - 1
      ? allSections[currentIndex + 1]
      : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [sectionId]);

  if (!section) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold">Section Not Found</h1>
          <Button asChild>
            <Link to="/docs">Go to Docs Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (section) {
      // last visited save
      localStorage.setItem(
        "lastVisited",
        JSON.stringify({
          id: section.id,
          title: section.title,
          categoryId: section.categoryId,
        }),
      );

      // read sections save
      const saved = localStorage.getItem("readSections");
      const readSections: string[] = saved ? JSON.parse(saved) : [];
      if (!readSections.includes(section.id)) {
        readSections.push(section.id);
        localStorage.setItem("readSections", JSON.stringify(readSections));
      }
    }
  }, [section?.id]);

  return (
    <div className="flex-1 min-w-0">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <MarkdownRenderer content={section.content} />

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
          {prevSection ? (
            <Link
              to={`/docs/${prevSection.id}`}
              className="group flex-1 flex flex-col items-start gap-1 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <span className="transform group-hover:-translate-x-1 transition-transform">
                  ←
                </span>{" "}
                Previous
              </span>
              <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                {prevSection.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1 hidden sm:block" />
          )}

          {nextSection && (
            <Link
              to={`/docs/${nextSection.id}`}
              className="group flex-1 flex flex-col items-end gap-1 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md text-right"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                Next{" "}
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
              <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                {nextSection.title}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocContent;
