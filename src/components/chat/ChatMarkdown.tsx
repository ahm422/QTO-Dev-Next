import type { ReactNode } from "react";
import { cn } from "@/components/theme/cn";

/**
 * Minimal markdown renderer scoped to what the RAG backend's replies actually use — bold,
 * bullet/numbered lists, links, paragraph breaks, `---` rules, and inline code. Not a general
 * CommonMark implementation; there's no markdown library in this codebase (see `RichText.tsx`
 * for the CMS-content equivalent, which sanitizes admin-authored HTML — a different shape of
 * problem). Builds React elements directly rather than parsing to an HTML string, so it's
 * inherently safe against injection: any literal `<`/`&` in the LLM's output renders as plain
 * text, never as markup.
 */

const INLINE_PATTERN =
  /\*\*(.+?)\*\*|`([^`]+?)`|\[([^\]]+?)\]\(([^)]+?)\)|(?:^|(?<=\s))\*([^*\s][^*]*?)\*(?=\s|$)|_([^_]+?)_/g;

let keySeq = 0;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  INLINE_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    const [, bold, code, linkText, linkHref, italicStar, italicUnderscore] = match;
    const key = `md-${keySeq++}`;

    if (bold !== undefined) {
      nodes.push(<strong key={key}>{bold}</strong>);
    } else if (code !== undefined) {
      nodes.push(
        <code key={key} className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.85em]">
          {code}
        </code>
      );
    } else if (linkText !== undefined) {
      nodes.push(
        <a
          key={key}
          href={linkHref}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline underline-offset-2 hover:no-underline"
        >
          {linkText}
        </a>
      );
    } else if (italicStar !== undefined) {
      nodes.push(<em key={key}>{italicStar}</em>);
    } else if (italicUnderscore !== undefined) {
      nodes.push(<em key={key}>{italicUnderscore}</em>);
    }

    lastIndex = INLINE_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

interface ChatMarkdownProps {
  content: string;
  className?: string;
}

export function ChatMarkdown({ content, className }: ChatMarkdownProps) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className={cn("space-y-2", className)}>
      {blocks.map((block, blockIndex) => {
        const trimmedBlock = block.trim();
        if (!trimmedBlock) return null;

        if (/^-{3,}$/.test(trimmedBlock)) {
          return <hr key={blockIndex} className="border-border" />;
        }

        const lines = block.split("\n").filter((line) => line.trim().length > 0);
        const isBulletList = lines.every((line) => /^\s*[-*]\s+/.test(line));
        const isNumberedList = lines.every((line) => /^\s*\d+\.\s+/.test(line));

        if (isBulletList) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol key={blockIndex} className="list-decimal space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.replace(/^\s*\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {renderInline(line)}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
