import { cn } from "@/components/theme/cn"
import { isHtmlBody, linkifyHtml, linkifyPlainText, sanitizeHtml, wrapTables } from "@/lib/sanitize-html"

interface RichTextProps {
  html: string
  className?: string
  as?: "div" | "span"
}

/**
 * Renders a CMS `description` field authored via `RichTextEditor`. Legacy
 * rows that still hold plain text (no markup) render as a plain paragraph —
 * see `isHtmlBody` — so this is backward compatible without a data migration.
 * A bare URL that was typed into the editor (or left in a legacy plain-text
 * row) but never wrapped with the toolbar Link button is auto-linkified — see
 * `linkifyHtml` for editor HTML and `linkifyPlainText` for legacy rows — then
 * rendered through the same `.prose-style` + `sanitizeHtml` path, so the link
 * gets brand styling and rel/target normalisation.
 * HTML is sanitized (see `sanitizeHtml`) before `dangerouslySetInnerHTML` to
 * prevent stored-XSS from admin-authored content.
 */
export function RichText({ html, className, as = "div" }: RichTextProps) {
  if (!html) return null

  if (!isHtmlBody(html)) {
    const linked = linkifyPlainText(html)
    if (!linked.includes("<a ")) {
      const Plain = as === "span" ? "span" : "p"
      return <Plain className={className}>{html}</Plain>
    }
    const PlainComp = as
    return (
      <PlainComp
        className={cn("prose-style", className)}
        dangerouslySetInnerHTML={{ __html: wrapTables(sanitizeHtml(linked)) }}
      />
    )
  }

  const Comp = as
  return (
    <Comp
      className={cn("prose-style", className)}
      dangerouslySetInnerHTML={{ __html: wrapTables(sanitizeHtml(linkifyHtml(html))) }}
    />
  )
}
