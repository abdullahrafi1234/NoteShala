import { getSectionById } from "@/lib/docsLoader";
import Markdown from "react-markdown";

type Props = {
  sectionId: string | null;
};

export default function DocsViewer({ sectionId }: Props) {
  if (!sectionId) {
    return <p className="p-6">Select a module</p>;
  }

  const section = getSectionById(sectionId);

  if (!section) {
    return <p className="p-6">Section not found</p>;
  }

  return (
    <article className="prose max-w-none p-6">
      <Markdown>{section.content}</Markdown>
    </article>
  );
}
