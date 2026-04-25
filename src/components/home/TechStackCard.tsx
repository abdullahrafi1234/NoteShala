import { ReactNode } from "react";

interface TechStackCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}

export const TechStackCard = ({
  icon,
  title,
  description,
  delay,
}: TechStackCardProps) => {
  return (
    <div
      className="group relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-muted/30 group-hover:bg-primary/10 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-110">
          {icon}
        </div>

        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
