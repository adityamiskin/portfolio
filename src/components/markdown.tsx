import { Markdown as TanStackMarkdown, type MarkdownComponents } from "@tanstack/markdown/react";

const components = {
  p: ({ children }) => <p className="whitespace-pre-line mb-4 last:mb-0">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href || "#"}
      className="text-foreground underline underline-offset-4 decoration-muted-foreground/60 hover:text-brand hover:decoration-brand transition-colors"
    >
      {children}
    </a>
  ),
} satisfies MarkdownComponents;

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <TanStackMarkdown components={components}>{children}</TanStackMarkdown>
    </div>
  );
}
