import { docsData, getAllSections } from "@/components/docs/loader";
import { HeroSection } from "@/components/home/HeroSection";
import { TechStackSection } from "@/components/home/TechStackSection";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowRight, BookOpen, FileText, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface LastVisited {
  id: string;
  title: string;
  categoryId: string;
}

// component এর বাইরে
const useCounter = (target: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

// component এর ভেতরে
const Index = () => {
  const [lastVisited, setLastVisited] = useState<LastVisited | null>(null);
  const [readCount, setReadCount] = useState(0);
  const allSections = getAllSections();
  const totalTopics = allSections.length;
  const totalMissions = docsData.length;

  const missionCount = useCounter(totalMissions); // ← এখানে
  const topicCount = useCounter(totalTopics); // ← এখানে

  // বাকি সব same
  useEffect(() => {
    const saved = localStorage.getItem("lastVisited");
    if (saved) setLastVisited(JSON.parse(saved));

    const readSections = localStorage.getItem("readSections");
    if (readSections) setReadCount(JSON.parse(readSections).length);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />

        {/* Stats Section */}

        <section className="py-8 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                {
                  icon: <Layers className="h-5 w-5" />,
                  value: missionCount,
                  label: "Missions",
                },
                {
                  icon: <FileText className="h-5 w-5" />,
                  value: topicCount,
                  label: "Topics",
                },
                {
                  icon: <BookOpen className="h-5 w-5" />,
                  value: "6",
                  label: "Months",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="text-primary">{stat.icon}</div>
                  <span className="text-3xl font-extrabold gradient-text">
                    {stat.value}+
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Your Progress
            </h2>
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-muted-foreground">
                  Topics Completed
                </span>
                <span className="text-sm font-bold text-primary">
                  {readCount} / {totalTopics}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${totalTopics > 0 ? (readCount / totalTopics) * 100 : 0}%`,
                    background: "var(--gradient-primary)",
                  }}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                {readCount === 0
                  ? "Start reading to track your progress!"
                  : readCount === totalTopics
                    ? "🎉 You've completed everything!"
                    : `${Math.round((readCount / totalTopics) * 100)}% completed — keep going!`}
              </p>
            </div>
          </div>
        </section>

        {/* Continue Reading */}
        {lastVisited && (
          <section className="py-8">
            <div className="container mx-auto px-4 max-w-2xl">
              <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Continue Reading
              </h2>
              <Link
                to={`/docs/${lastVisited.id}`}
                className="group flex items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {lastVisited.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lastVisited.categoryId}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </section>
        )}

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
