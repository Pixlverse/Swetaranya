import { Fragment, type ReactNode } from "react";

/**
 * Deliberately tiny renderer for admin-authored text: blank-line paragraphs, "## " / "### " headings,
 * "- " lists, "> " quotes, *italic* and **bold**. No HTML is ever injected.
 */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Markdown({ text, className = "prose-swet" }: { text: string; className?: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const b = block.trim();
        if (b.startsWith("### ")) return <h3 key={i}>{inline(b.slice(4))}</h3>;
        if (b.startsWith("## ")) return <h2 key={i}>{inline(b.slice(3))}</h2>;
        if (b.startsWith("> ")) return <blockquote key={i}>{inline(b.replace(/^>\s?/gm, ""))}</blockquote>;
        if (b.split("\n").every((l) => l.trim().startsWith("- ")))
          return (
            <ul key={i}>
              {b.split("\n").map((l, j) => (
                <li key={j}>{inline(l.trim().slice(2))}</li>
              ))}
            </ul>
          );
        return <p key={i}>{inline(b)}</p>;
      })}
    </div>
  );
}

export const paragraphs = (text: string) => text.trim().split(/\n\s*\n/).filter(Boolean);
