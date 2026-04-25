import type { DocSection } from "@/components/docs/interfaces";
import { getAllSections } from "@/components/docs/loader";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowRight, FileText, Hash, Search, Type } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  headingText: string;
  headingLevel: number; // 1=# 2=## 3=### 0=bold -1=normal text
  slug: string;
  priority: number; // sort এর জন্য
}

const slugify = (text: string): string => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const extractAll = (section: DocSection): SearchResult[] => {
  if (!section.content) return [];

  const lines = section.content.split("\n");
  const results: SearchResult[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // # ## ### heading
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();
      results.push({
        sectionId: section.id,
        sectionTitle: section.title,
        headingText,
        headingLevel: level,
        slug: slugify(headingText),
        priority: level, // 1, 2, 3
      });
      continue;
    }

    // **bold** text
    const boldMatches = [...trimmed.matchAll(/\*\*(.*?)\*\*/g)];
    for (const m of boldMatches) {
      const boldText = m[1].trim();
      if (boldText.length < 3) continue;
      results.push({
        sectionId: section.id,
        sectionTitle: section.title,
        headingText: boldText,
        headingLevel: 0,
        slug: slugify(boldText),
        priority: 4,
      });
    }

    // normal text — code block বাদ দাও
    const isCode = trimmed.startsWith("```") || trimmed.startsWith("    ");
    if (!isCode && !headingMatch && boldMatches.length === 0) {
      // markdown syntax বাদ দাও
      const cleanText = trimmed
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .trim();

      if (cleanText.length > 5) {
        results.push({
          sectionId: section.id,
          sectionTitle: section.title,
          headingText: cleanText,
          headingLevel: -1,
          slug: "",
          priority: 5,
        });
      }
    }
  }

  return results;
};

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const sections = useMemo(() => getAllSections(), []);

  const allItems = useMemo(() => {
    return sections.flatMap((section) => extractAll(section));
  }, [sections]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return allItems
      .filter((item) => item.headingText.toLowerCase().includes(q))
      .sort((a, b) => a.priority - b.priority) // priority অনুযায়ী sort
      .slice(0, 12);
  }, [query, allItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleSelect = (result: SearchResult) => {
    if (result.headingLevel === -1 || result.headingLevel === 0) {
      navigate(`/docs/${result.sectionId}`);
    } else {
      navigate(`/docs/${result.sectionId}#${result.slug}`);

      // page render হওয়ার জন্য একটু বেশি wait করো
      setTimeout(() => {
        const el = document.getElementById(result.slug);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.classList.add("highlight-heading");
          setTimeout(() => el.classList.remove("highlight-heading"), 2500);
        }
      }, 500); // 150 → 500
    }
    onOpenChange(false);
    setQuery("");
  };

  const getIcon = (level: number) => {
    if (level === 1) return <FileText className="h-4 w-4" />;
    if (level === 2 || level === 3) return <Hash className="h-4 w-4" />;
    if (level === 0)
      return <span className="text-xs font-black px-0.5">B</span>;
    return <Type className="h-4 w-4" />;
  };

  const getLabel = (result: SearchResult) => {
    if (result.headingLevel === -1) return result.headingText;
    if (result.headingLevel === 0) return `** ${result.headingText}`;
    return `${"#".repeat(result.headingLevel)} ${result.headingText}`;
  };

  const getFontSize = (level: number) => {
    if (level === 1) return "1rem";
    if (level === 2) return "0.95rem";
    if (level === 3) return "0.875rem";
    if (level === 0) return "0.825rem";
    return "0.8rem";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden sm:rounded-xl bg-background border shadow-2xl w-[95vw] sm:w-full top-[5vh] sm:top-[50%] translate-y-0 sm:translate-y-[-50%]">
        {/* এই দুই line যোগ করুন */}
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search in docs
        </DialogDescription>

        {/* <div className="flex items-center border-b px-4 py-3"></div> */}

        <div className="flex items-center border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="border-0 focus-visible:ring-0 text-lg shadow-none"
            autoFocus
          />
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-12 text-center text-muted-foreground opacity-50">
              <p>Search in headings, bold text and content</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No results for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, index) => (
                <button
                  key={`${result.sectionId}-${result.slug}-${index}`}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-muted transition-all text-left group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                    {getIcon(result.headingLevel)}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <p
                      className="font-bold text-foreground truncate"
                      style={{ fontSize: getFontSize(result.headingLevel) }}
                    >
                      {getLabel(result)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate opacity-70 mt-0.5">
                      {result.sectionTitle}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t bg-muted/50 text-[10px] text-muted-foreground flex gap-3 uppercase font-bold">
          <span>Enter to select</span>
          <span>Esc to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
