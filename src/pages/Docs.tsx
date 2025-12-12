import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/docs/Sidebar";
import { MobileSidebar } from "@/components/docs/MobileSidebar";
import { DocContent } from "@/components/docs/DocContent";

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <div className="lg:hidden p-4 border-b border-border">
            <MobileSidebar />
          </div>
          <DocContent />
        </div>
      </div>
    </div>
  );
};

export default Docs;
