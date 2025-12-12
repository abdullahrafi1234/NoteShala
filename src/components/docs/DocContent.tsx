import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSectionById, getAllSections } from "@/data/docsContent";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Button } from "@/components/ui/button";

export const DocContent = () => {
  const { sectionId } = useParams();
  const allSections = getAllSections();
  const section = sectionId ? getSectionById(sectionId) : allSections[0];
  
  const currentIndex = section 
    ? allSections.findIndex(s => s.id === section.id)
    : 0;
  
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  if (!section) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Section Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The requested documentation section could not be found.
          </p>
          <Button asChild>
            <Link to="/docs">Go to Docs Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 animate-fade-in">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <MarkdownRenderer content={section.content} />

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between gap-4">
          {prevSection ? (
            <Link
              to={`/docs/${prevSection.id}`}
              className="group flex flex-col items-start p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all max-w-[45%]"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <ChevronLeft className="h-3 w-3" />
                Previous
              </span>
              <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate max-w-full">
                {prevSection.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextSection ? (
            <Link
              to={`/docs/${nextSection.id}`}
              className="group flex flex-col items-end p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all max-w-[45%] ml-auto"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                Next
                <ChevronRight className="h-3 w-3" />
              </span>
              <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate max-w-full">
                {nextSection.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};
