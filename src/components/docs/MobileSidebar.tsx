import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { docsData } from "@/data/docsContent";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const MobileSidebar = () => {
  const { sectionId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    docsData.map(cat => cat.id)
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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
                        "sidebar-item block",
                        sectionId === section.id && "sidebar-item-active"
                      )}
                    >
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
