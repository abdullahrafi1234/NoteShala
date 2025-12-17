// import { docsData } from "@/data/docsData";
import { docsData } from "@/components/docs/loader"; // তোমার path
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export const Sidebar = () => {
  const { sectionId } = useParams();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    docsData.map((cat) => cat.id)
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-sidebar h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden lg:block">
      <nav className="p-4 space-y-2">
        {docsData.map((category, catIndex) => (
          <div
            key={category.id}
            className="animate-slide-in-left"
            style={{ animationDelay: `${catIndex * 50}ms` }}
          >
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
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-4 animate-fade-in">
                {category.sections.map((section) => (
                  <Link
                    key={section.id}
                    to={`/docs/${section.id}`}
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
    </aside>
  );
};
