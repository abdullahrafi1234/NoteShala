import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { TechStackSection } from "@/components/home/TechStackSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <TechStackSection />
        
        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Built with React, TypeScript & Tailwind CSS</p>
            <p className="mt-2">MIT License © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
