import { getAllSections, getSectionById } from "@/components/docs/loader";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MarkdownRenderer } from "./MarkdownRenderer";

const BOOKMARK_KEY = "noteshala_bookmarks";

function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: string[]) {
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
}

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

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showToast, setShowToast] = useState<"added" | "removed" | null>(null);

  // bookmark state load
  useEffect(() => {
    if (section) {
      const bookmarks = getBookmarks();
      setIsBookmarked(bookmarks.includes(section.id));
    }
  }, [section?.id]);

  // toast auto hide
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const toggleBookmark = () => {
    if (!section) return;
    const bookmarks = getBookmarks();
    let updated: string[];
    if (isBookmarked) {
      updated = bookmarks.filter((id) => id !== section.id);
      setShowToast("removed");
    } else {
      updated = [...bookmarks, section.id];
      setShowToast("added");
    }
    saveBookmarks(updated);
    setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [sectionId]);

  useEffect(() => {
    if (section) {
      localStorage.setItem(
        "lastVisited",
        JSON.stringify({
          id: section.id,
          title: section.title,
          categoryId: section.categoryId,
        }),
      );
      const saved = localStorage.getItem("readSections");
      const readSections: string[] = saved ? JSON.parse(saved) : [];
      if (!readSections.includes(section.id)) {
        readSections.push(section.id);
        localStorage.setItem("readSections", JSON.stringify(readSections));
      }
    }
  }, [section?.id]);

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

  return (
    <div className="flex-1 min-w-0 relative">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border shadow-xl animate-fade-in-up">
          <Bookmark
            className={`h-4 w-4 ${showToast === "added" ? "text-primary fill-primary" : "text-muted-foreground"}`}
          />
          <span className="text-sm font-semibold text-foreground">
            {showToast === "added" ? "Bookmarked!" : "Bookmark removed"}
          </span>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Bookmark Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleBookmark}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-300",
              isBookmarked
                ? "bg-primary/10 border-primary/50 text-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary",
            ].join(" ")}
          >
            <Bookmark
              className={`h-4 w-4 transition-all duration-300 ${isBookmarked ? "fill-primary" : ""}`}
            />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>

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
