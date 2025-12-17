import { getAllSections, getSectionById } from "@/components/docs/loader"; // তোমার loader file
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { MarkdownRenderer } from "./MarkdownRenderer";

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
    <div className="flex-1 min-w-0">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* এখানে direct content use করো – কোনো loading নেই! */}
        <MarkdownRenderer content={section.content} />

        {/* Previous / Next navigation – তোমার আগের code same রাখো */}
        <div className="mt-16 pt-8 border-t flex justify-between">
          {prevSection && (
            <Link to={`/docs/${prevSection.id}`}>← {prevSection.title}</Link>
          )}
          {nextSection && (
            <Link to={`/docs/${nextSection.id}`}>{nextSection.title} →</Link>
          )}
        </div>
      </div>
    </div>
  );
};
