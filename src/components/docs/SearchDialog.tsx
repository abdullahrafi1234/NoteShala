import type { DocSection } from "@/components/docs/interfaces";
import { getAllSections } from "@/components/docs/loader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowRight, FileText, Hash, Search } from "lucide-react";
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
  headingLevel: number;
  slug: string;
}

const slugify = (text: string): string => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const extractHeadings = (section: DocSection): SearchResult[] => {
  if (!section.content) return [];

  const lines = section.content.split("\n");
  const results: SearchResult[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const headingText = headingMatch[2].trim();
      results.push({
        sectionId: section.id,
        sectionTitle: section.title,
        headingText,
        headingLevel: headingMatch[1].length,
        slug: slugify(headingText),
      });
      continue;
    }

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
      });
    }
  }

  return results;
};

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const sections = useMemo(() => getAllSections(), []);

  const allHeadings = useMemo(() => {
    return sections.flatMap((section) => extractHeadings(section));
  }, [sections]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allHeadings
      .filter((h) => h.headingText.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query, allHeadings]);

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
    if (result.headingLevel === 0) {
      navigate(`/docs/${result.sectionId}`);
    } else {
      navigate(`/docs/${result.sectionId}#${result.slug}`);
      setTimeout(() => {
        const el = document.getElementById(result.slug);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden sm:rounded-xl bg-background border shadow-2xl">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search headings and bold text..."
            className="border-0 focus-visible:ring-0 text-lg shadow-none"
            autoFocus
          />
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-12 text-center text-muted-foreground opacity-50">
              <p>Search in # ## ### headings and bold text</p>
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
                    {result.headingLevel === 0 ? (
                      <span className="text-xs font-black px-0.5">B</span>
                    ) : result.headingLevel === 1 ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Hash className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <p
                      className="font-bold text-foreground truncate"
                      style={{
                        fontSize:
                          result.headingLevel === 0
                            ? "0.825rem"
                            : result.headingLevel === 1
                              ? "1rem"
                              : result.headingLevel === 2
                                ? "0.95rem"
                                : "0.875rem",
                      }}
                    >
                      {result.headingLevel === 0
                        ? `** ${result.headingText}`
                        : `${"#".repeat(result.headingLevel)} ${result.headingText}`}
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
