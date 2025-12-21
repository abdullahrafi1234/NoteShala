import type { DocSection } from "@/components/docs/interfaces";
import { getAllSections } from "@/components/docs/loader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Fuse, { FuseResult } from "fuse.js";
import { ArrowRight, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const sections = useMemo(() => getAllSections(), []);

  // আপনার রিকোয়েস্ট অনুযায়ী শুধু #, ##, ### এবং ** ফিল্টার করার ফাংশন
  const extractSpecificText = (content: string) => {
    if (!content) return "";

    // ১. হেডিং ম্যাচ: #, ##, ###
    const headingRegex = /^#{1,3}\s+(.+)$/gm;
    // ২. বোল্ড টেক্সট ম্যাচ: **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    // ৩. কোলন যুক্ত কি-ওয়ার্ড ম্যাচ (যেমন: Frameworks:)
    const keywordRegex = /^([A-Z][\w\s]+:)$/gm;

    const matchedParts: string[] = [];
    let match;

    // হেডিং সংগ্রহ
    while ((match = headingRegex.exec(content)) !== null) {
      matchedParts.push(match[1].trim());
    }

    // বোল্ড টেক্সট সংগ্রহ
    while ((match = boldRegex.exec(content)) !== null) {
      matchedParts.push(match[1].trim());
    }

    // কোলন যুক্ত কি-ওয়ার্ড সংগ্রহ (যেমন: Frameworks:)
    while ((match = keywordRegex.exec(content)) !== null) {
      matchedParts.push(match[1].replace(":", "").trim());
    }

    return matchedParts.join(" ");
  };

  // ডাটাবেজ প্রসেসিং
  const processedData = useMemo(() => {
    return sections.map((section) => ({
      ...section,
      // এই ফিল্ডে শুধু আপনার চাওয়া টেক্সটগুলো থাকবে
      onlySpecifics: extractSpecificText(section.content),
    }));
  }, [sections]);

  // Fuse.js কনফিগারেশন
  const fuse = useMemo(
    () =>
      new Fuse(processedData, {
        keys: [
          { name: "title", weight: 0.3 }, // ফাইলের নাম
          { name: "onlySpecifics", weight: 0.7 }, // আপনার স্পেসিফিক হেডিং ও বোল্ড লেখা
        ],
        threshold: 0.3,
        minMatchCharLength: 2,
        shouldSort: true,
      }),
    [processedData]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 8);
  }, [query, fuse]);

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

  const handleSelect = (section: DocSection) => {
    navigate(`/docs/${section.id}`);
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
            placeholder="Search headings and key terms..."
            className="border-0 focus-visible:ring-0 text-lg shadow-none"
            autoFocus
          />
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-12 text-center text-muted-foreground opacity-50">
              <p>Search specifically in Headings and Bold terms</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No results for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res: FuseResult<DocSection>) => (
                <button
                  key={res.item.id}
                  onClick={() => handleSelect(res.item)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-muted transition-all text-left group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-foreground truncate">
                      {res.item.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate opacity-70">
                      In: {res.item.id}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
