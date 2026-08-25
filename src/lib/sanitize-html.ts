import sanitize from "sanitize-html"

/**
 * Tags/attributes allowed out of the admin RichTextEditor. Keep this in sync
 * with the toolbar in `src/components/ui/rich-text-editor.tsx` — anything the
 * editor can produce must be allow-listed here, and nothing else should be.
 */
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "code",
  "ul", "ol", "li",
  "a",
  "h1", "h2", "h3", "h4",
  "blockquote",
]

const ALLOWED_ATTR = ["href", "target", "rel"]

/**
 * Sanitizes HTML produced by the admin RichTextEditor before it is rendered
 * on the public site via `dangerouslySetInnerHTML`, to prevent stored-XSS
 * from admin-authored (or legacy/plain-text) content.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ""
  return sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ALLOWED_ATTR },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  })
}

/**
 * Heuristic used to tell RichTextEditor-authored HTML apart from legacy
 * plain-text `description` values already stored in the database, so both
 * render correctly without a data migration.
 */
export function isHtmlBody(body: string): boolean {
  return /<[a-z][\s\S]*>/i.test(body)
}

/**
 * Strips markup down to plain text — for contexts that need a plain string
 * (SEO/meta descriptions, card previews, search matching) even when the
 * source field now holds RichTextEditor HTML.
 */
export function stripHtml(html: string): string {
  if (!html) return ""
  if (!isHtmlBody(html)) return html
  return sanitizeHtml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
