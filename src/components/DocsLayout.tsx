import DocsViewer from "./docs/DocsViewer";
import Sidebar from "./Sidebar";

export default function DocsLayout({
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="flex">
      <Sidebar
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <DocsViewer sectionId={activeSection} />
    </div>
  );
}
