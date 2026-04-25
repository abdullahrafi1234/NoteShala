import { TechStackCard } from "./TechStackCard";

const techStack = [
  {
    icon: (
      <img
        src="https://skillicons.dev/icons?i=ts"
        className="w-12 h-12 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
      />
    ),
    title: "TypeScript",
    description: "Mastering types & interfaces for scalable code",
  },
  {
    icon: (
      <img
        src="https://skillicons.dev/icons?i=nodejs"
        className="w-12 h-12 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
      />
    ),
    title: "Node.js",
    description: "Building fast, scalable backend applications",
  },
  {
    icon: (
      <img
        src="https://skillicons.dev/icons?i=express"
        className="w-12 h-12  transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
      />
    ),
    title: "Express",
    description: "Creating RESTful APIs with middleware",
  },
  {
    icon: (
      <img
        src="https://skillicons.dev/icons?i=go"
        className="w-12 h-12  transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
      />
    ),
    title: "Golang",
    description: "High-performance concurrent programming",
  },
  {
    icon: (
      <img
        src="https://skillicons.dev/icons?i=nextjs"
        className="w-12 h-12  transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
      />
    ),
    title: "Next.js",
    description: "Full-stack React framework for production",
  },
  {
    icon: (
      <img
        src="https://skillicons.dev/icons?i=postgres"
        className="w-12 h-12  transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
      />
    ),
    title: "PostgreSQL",
    description: "Advanced relational database management",
  },
  {
    icon: (
      <img
        src="https://skillicons.dev/icons?i=prisma"
        className="w-12 h-12  transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
      />
    ),
    title: "Prisma",
    description: "Type-safe database access & migrations",
  },
  {
    icon: (
      <img
        src="https://skillicons.dev/icons?i=docker"
        className="w-12 h-12  transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
      />
    ),
    title: "Docker",
    description: "Containerizing applications for deployment",
  },
  {
    icon: (
      <img
        src="https://skillicons.dev/icons?i=nginx"
        className="w-12 h-12  transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
      />
    ),
    title: "Nginx",
    description: "Web server & reverse proxy configuration",
  },
];

export const TechStackSection = () => {
  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fade-in-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Tech Stack
          </h2>
          <p
            className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up opacity-0 animation-delay-100"
            style={{ animationFillMode: "forwards" }}
          >
            Master the modern web development stack through hands-on projects
            and comprehensive documentation
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {techStack.map((tech, index) => (
            <TechStackCard
              key={tech.title}
              icon={tech.icon}
              title={tech.title}
              description={tech.description}
              delay={200 + index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
