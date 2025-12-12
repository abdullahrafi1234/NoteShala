import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <Sparkles className="h-4 w-4" />
          <span>6-Month Intensive Bootcamp</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 animate-fade-in-up opacity-0 animation-delay-100" style={{ animationFillMode: 'forwards' }}>
          <span className="gradient-text">Next Level</span>
          <br />
          <span className="text-foreground">Bootcamp Notes</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-4 animate-fade-in-up opacity-0 animation-delay-200" style={{ animationFillMode: 'forwards' }}>
          6-Month Journey Learning{" "}
          <span className="text-foreground font-medium">TypeScript</span>,{" "}
          <span className="text-foreground font-medium">Node.js</span>,{" "}
          <span className="text-foreground font-medium">Express</span>,{" "}
          <span className="text-foreground font-medium">Golang</span>,{" "}
          <span className="text-foreground font-medium">Next.js</span>,{" "}
          <span className="text-foreground font-medium">PostgreSQL</span>,{" "}
          <span className="text-foreground font-medium">Prisma</span>,{" "}
          <span className="text-foreground font-medium">Docker</span> &{" "}
          <span className="text-foreground font-medium">Nginx</span>.
        </p>

        {/* Tagline */}
        <p className="text-muted-foreground mb-10 italic animate-fade-in-up opacity-0 animation-delay-300" style={{ animationFillMode: 'forwards' }}>
          "Learning, Building, and Documenting — One Stack at a Time."
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in-up opacity-0 animation-delay-400" style={{ animationFillMode: 'forwards' }}>
          <Button asChild variant="hero" size="xl">
            <Link to="/docs" className="gap-3">
              Start Reading
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};
