import { docsData, getAllSections } from "@/components/docs/loader";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Bookmark, ChevronDown, ChevronRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BOOKMARK_KEY = "noteshala_bookmarks";

function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const MobileSidebar = () => {
  const { sectionId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    docsData.map((cat) => cat.id),
  );
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [showAllBookmarks, setShowAllBookmarks] = useState(false);
  const allSections = getAllSections();

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, [isOpen, sectionId]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const bookmarkedSections = allSections.filter((s) =>
    bookmarks.includes(s.id),
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-left">Documentation</SheetTitle>
        </SheetHeader>
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {/* Bookmarks */}
          {bookmarkedSections.length > 0 && (
            <div className="mb-2">
              <button
                onClick={() => setShowBookmarks((prev) => !prev)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold text-primary rounded-lg hover:bg-primary/10 transition-all duration-200"
              >
                {showBookmarks ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
                <Bookmark className="h-4 w-4 shrink-0 fill-primary" />
                <span>Bookmarks</span>
                <span className="ml-auto text-xs bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">
                  {bookmarkedSections.length}
                </span>
              </button>

              {showBookmarks && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/30 pl-4">
                  {bookmarkedSections
                    .slice(0, showAllBookmarks ? bookmarkedSections.length : 1)
                    .map((section) => (
                      <Link
                        key={section.id}
                        to={`/docs/${section.id}`}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted transition-colors text-sm",
                          sectionId === section.id &&
                            "text-primary font-semibold",
                        )}
                      >
                        <Bookmark className="h-3 w-3 shrink-0 fill-primary text-primary" />
                        <span className="truncate">{section.title}</span>
                      </Link>
                    ))}

                  {bookmarkedSections.length > 1 && (
                    <button
                      onClick={() => setShowAllBookmarks((prev) => !prev)}
                      className="text-xs font-bold text-primary pl-2 py-1 hover:underline"
                    >
                      {showAllBookmarks
                        ? "Show less ↑"
                        : `+${bookmarkedSections.length - 1} more ↓`}
                    </button>
                  )}
                </div>
              )}

              <div className="border-t border-border mt-3 mb-1" />
            </div>
          )}

          {/* All Missions */}
          {docsData.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold text-foreground hover:text-primary rounded-lg hover:bg-muted/50 transition-all duration-200"
              >
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
                <span className="mr-2">{category.icon}</span>
                <span className="truncate text-left">{category.title}</span>
              </button>

              {expandedCategories.includes(category.id) && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-4">
                  {category.sections.map((section) => (
                    <Link
                      key={section.id}
                      to={`/docs/${section.id}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 sidebar-item ",
                        sectionId === section.id && "sidebar-item-active",
                      )}
                    >
                      {bookmarks.includes(section.id) && (
                        <Bookmark className="h-3 w-3 shrink-0 fill-primary text-primary" />
                      )}
                      {section.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
