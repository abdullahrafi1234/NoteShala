import { SearchDialog } from "@/components/docs/SearchDialog";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDocsPage = location.pathname.startsWith("/docs");

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Docs Icon with Tooltip */}
              <div className="relative">
                <Link
                  to="/docs"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`group flex items-center transition-colors hover:text-primary ${
                    isDocsPage ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`relative p-2 rounded-lg transition-all duration-300 ${
                      isDocsPage ? "bg-primary/15" : "hover:bg-muted/50"
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <defs>
                        <linearGradient
                          id="docIconGrad"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                        stroke="url(#docIconGrad)"
                      />
                      <path
                        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                        stroke="url(#docIconGrad)"
                      />
                      <path d="M8 7h8" stroke="url(#docIconGrad)" />
                      <path d="M8 11h8" stroke="url(#docIconGrad)" />
                      <path d="M8 15h5" stroke="url(#docIconGrad)" />
                    </svg>

                    {isDocsPage && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
                    )}
                  </div>
                </Link>

                {/* Tooltip */}
                {showTooltip && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg bg-popover border border-border shadow-lg text-xs font-semibold text-foreground whitespace-nowrap animate-fade-in">
                    Documentation
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-popover border-l border-t border-border" />
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Search Button */}
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
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abdullah-al-rafi-bhuiyan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Mobile Buttons */}
            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <defs>
                      <linearGradient
                        id="docIconGradMobile"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                      stroke="url(#docIconGradMobile)"
                    />
                    <path
                      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                      stroke="url(#docIconGradMobile)"
                    />
                    <path d="M8 7h8" stroke="url(#docIconGradMobile)" />
                    <path d="M8 11h8" stroke="url(#docIconGradMobile)" />
                    <path d="M8 15h5" stroke="url(#docIconGradMobile)" />
                  </svg>
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

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};
