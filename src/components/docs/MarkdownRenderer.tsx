import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { codeToHtml } from "shiki";

interface MarkdownRendererProps {
  content: string;
}

const slugify = (text: string): string => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

interface CodeBlockProps {
  language: string;
  children: string;
}

const CodeBlock = ({ language, children }: CodeBlockProps) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    codeToHtml(children, {
      lang: language || "text",
      theme: "dracula",
    })
      .then(setHtml)
      .catch(() => {
        codeToHtml(children, { lang: "text", theme: "dark-plus" }).then(
          setHtml,
        );
      });
  }, [children, language]);

  if (!html) {
    return (
      <pre
        style={{
          background: "hsl(210 25% 10%)",
          borderRadius: "0.75rem",
          padding: "1rem",
          fontSize: "0.875rem",
          overflowX: "auto",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <code>{children}</code>
      </pre>
    );
  }

  return (
    <div
      className="mb-4 rounded-xl overflow-hidden text-sm"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose-docs max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "");

            if (!match) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-primary font-medium font-mono">
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={match[1]}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          },

          h1({ children }) {
            const id = slugify(String(children));
            return (
              <h1
                id={id}
                className="text-3xl font-bold text-foreground mb-6 mt-0 first:mt-0 scroll-mt-20"
              >
                {children}
              </h1>
            );
          },

          h2({ children }) {
            const id = slugify(String(children));
            return (
              <h2
                id={id}
                className="text-2xl font-semibold text-foreground mb-4 mt-8 pb-2 border-b border-border scroll-mt-20"
              >
                {children}
              </h2>
            );
          },

          h3({ children }) {
            const id = slugify(String(children));
            return (
              <h3
                id={id}
                className="text-xl font-semibold text-foreground mb-3 mt-6 scroll-mt-20"
              >
                {children}
              </h3>
            );
          },

          p({ children }) {
            return (
              <p className="mb-4 text-foreground/80 leading-relaxed">
                {children}
              </p>
            );
          },

          ul({ children }) {
            return (
              <ul className="mb-4 pl-6 space-y-2 list-disc">{children}</ul>
            );
          },

          ol({ children }) {
            return (
              <ol className="mb-4 pl-6 space-y-2 list-decimal">{children}</ol>
            );
          },

          li({ children }) {
            return <li className="text-foreground/80">{children}</li>;
          },

          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 bg-muted/30 py-2 rounded-r-lg">
                {children}
              </blockquote>
            );
          },

          a({ href, children }) {
            const isExternal =
              typeof href === "string" && href.startsWith("http");
            return (
              <a
                href={href}
                className="text-primary hover:text-accent underline underline-offset-2 transition-colors"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },

          table({ children }) {
            return (
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse">{children}</table>
              </div>
            );
          },

          thead({ children }) {
            return <thead className="bg-muted">{children}</thead>;
          },

          th({ children }) {
            return (
              <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                {children}
              </th>
            );
          },

          td({ children }) {
            return (
              <td className="border border-border px-4 py-2 text-foreground/80">
                {children}
              </td>
            );
          },

          pre({ children }) {
            return (
              <pre className="mb-4 overflow-x-auto rounded-lg">{children}</pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
