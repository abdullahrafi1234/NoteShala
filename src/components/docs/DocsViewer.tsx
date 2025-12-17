import { getAllSections, getSectionById } from "@/./data/docsData"; // বা তোমার path
import { loadMarkdownContent } from "@/utils/loadMarkdown";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MarkdownRenderer } from "./MarkdownRenderer";

export const DocContent = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const allSections = getAllSections();
  const section = sectionId ? getSectionById(sectionId) : allSections[0];

  const [content, setContent] = useState<string>("Loading...");

  const currentIndex = section
    ? allSections.findIndex((s) => s.id === section.id)
    : 0;

  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < allSections.length - 1
      ? allSections[currentIndex + 1]
      : null;

  useEffect(() => {
    if (section && section.markdownPath) {
      loadMarkdownContent(section.markdownPath).then(setContent);
    }
  }, [section?.id]);

  // ... বাকি code same (not found, navigation)

  return (
    <div className="flex-1 min-w-0 animate-fade-in">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <MarkdownRenderer content={content} />
        {/* Navigation same as তোমার code */}
      </div>
    </div>
  );
};
