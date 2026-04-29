import { useEffect, useMemo, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

const slugify = (text: string): string => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

function extractHeadings(content: string): Heading[] {
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const headings: Heading[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      headings.push({
        id: slugify(text),
        text,
        level: match[1].length,
      });
    }
  }
  console.log("headings found:", headings.length, headings); // ← যোগ করুন
  return headings;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");

  // useMemo দিয়ে headings cache করা — প্রতি render এ নতুন array হবে না
  const headings = useMemo(() => extractHeadings(content), [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    // content render হওয়ার জন্য wait করো
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
            );
          if (visible.length > 0) {
            setActiveId(visible[0].target.id);
          }
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
      );

      headings.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }, 300); // ← 300ms delay

    return () => clearTimeout(timer);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="w-full">
      <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto px-4 py-8">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 px-2">
          On this page
        </p>
        <nav className="space-y-0.5">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(heading.id);
                }
              }}
              className={[
                "block text-xs py-1.5 px-2 rounded-lg transition-all duration-200 truncate",
                heading.level === 1
                  ? "font-bold"
                  : heading.level === 2
                    ? "pl-4 font-semibold"
                    : "pl-6 font-medium",
                activeId === heading.id
                  ? "text-primary bg-primary/10 border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              ].join(" ")}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
