import { docsData } from "@/components/docs/loader";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  sectionId: string;
}

export const Breadcrumb = ({ sectionId }: BreadcrumbProps) => {
  let categoryTitle = "";
  let sectionTitle = "";

  for (const cat of docsData) {
    const section = cat.sections.find((s) => s.id === sectionId);
    if (section) {
      categoryTitle = cat.title;
      sectionTitle = section.title;
      break;
    }
  }

  if (!categoryTitle) return null;

  return (
    <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-border/50 bg-muted/10 text-xs text-muted-foreground overflow-hidden">
      <Link
        to="/docs"
        className="hover:text-primary transition-colors shrink-0 font-semibold"
      >
        Docs
      </Link>
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate font-semibold text-foreground/70">
        {categoryTitle}
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate font-bold text-primary">{sectionTitle}</span>
    </div>
  );
};
