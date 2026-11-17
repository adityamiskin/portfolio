// Supports only paragraphs and [links](url) — all the portfolio copy needs, without shipping a markdown parser.
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function renderInline(text: string) {
  return text.split(LINK).map((part, i, parts) => {
    if (i % 3 === 0) return part;
    if (i % 3 === 2) return null;
    return (
      <a
        key={i}
        href={parts[i + 1]}
        className="text-foreground underline underline-offset-4 decoration-muted-foreground/60 hover:text-brand hover:decoration-brand transition-colors"
      >
        {part}
      </a>
    );
  });
}

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={className}>
      {children.split(/\n{2,}/).map((paragraph, i) => (
        <p key={i} className="whitespace-pre-line mb-4 last:mb-0">
          {renderInline(paragraph.trim())}
        </p>
      ))}
    </div>
  );
}
