import { SearchDialog } from "@/components/docs/SearchDialog";
import { Button } from "@/components/ui/button";
import { FileText, Github, Linkedin, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isDocsPage = location.pathname.startsWith("/docs");

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Left Side */}
            <Link
              to="/"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              <img
                className="h-10 !w-10 object-contain"
                src="/N-logo.png"
                alt="NoteShala"
              />
              <span className="font-bold text-2xl hidden md:inline">
                NoteShala
              </span>
            </Link>

            {/* Desktop Navigation - Right Side */}
            <div className="hidden md:flex items-center gap-6">
              {/* Docs Link */}
              <Link
                to="/docs"
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isDocsPage ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <FileText className="h-4 w-4" />
                Docs
              </Link>

              {/* Search Button - Fixed Width + Better Behavior */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="w-[260px] max-w-[280px] justify-start text-muted-foreground hover:bg-muted/50"
              >
                <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Search docs...</span>
                <div className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </div>
              </Button>

              {/* Social Links */}
              <div className="flex items-center gap-4 pl-2 border-l border-border">
                <a
                  href="https://github.com/abdullahrafi1234/NoteShala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub Repository"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abdullah-al-rafi-bhuiyan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Mobile Menu Buttons */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search documentation"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-4">
                <Link
                  to="/docs"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    isDocsPage ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Docs
                </Link>

                <a
                  href="https://github.com/abdullahrafi1234/NoteShala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>

                <a
                  href="https://www.linkedin.com/in/abdullah-al-rafi-bhuiyan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};
