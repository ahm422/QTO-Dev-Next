import { cn } from "@/components/theme/cn"
import { isHtmlBody, sanitizeHtml } from "@/lib/sanitize-html"

interface RichTextProps {
  html: string
  className?: string
  as?: "div" | "span"
}

/**
 * Renders a CMS `description` field authored via `RichTextEditor`. Legacy
 * rows that still hold plain text (no markup) render as a plain paragraph —
 * see `isHtmlBody` — so this is backward compatible without a data migration.
 * HTML is sanitized (see `sanitizeHtml`) before `dangerouslySetInnerHTML` to
 * prevent stored-XSS from admin-authored content.
 */
export function RichText({ html, className, as = "div" }: RichTextProps) {
  if (!html) return null

  if (!isHtmlBody(html)) {
    const Plain = as === "span" ? "span" : "p"
    return <Plain className={className}>{html}</Plain>
  }

  const Comp = as
  return (
    <Comp
      className={cn("prose-style", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  )
}
