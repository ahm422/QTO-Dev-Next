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
  "blockquote", "hr",
  "img",
]

const ALLOWED_ATTR = ["href", "target", "rel"]

/** Attributes kept on <img> — the editor's Image button emits src/alt; the
 * rest are tolerated on pasted markup. `src` schemes are further restricted
 * to https + root-relative below (media is served from R2 over https, or the
 * dev `/api/media/...` proxy). */
const ALLOWED_IMG_ATTR = ["src", "alt", "title", "width", "height", "loading"]

/**
 * Sanitizes HTML produced by the admin RichTextEditor before it is rendered
 * on the public site via `dangerouslySetInnerHTML`, to prevent stored-XSS
 * from admin-authored (or legacy/plain-text) content.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ""
  return sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ALLOWED_ATTR, img: ALLOWED_IMG_ATTR },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // <img src> may only be https or a root-relative path — never http:,
    // data:, javascript:, or a protocol-relative //host. Relative URLs have
    // no scheme so they pass this check (dev serves media from /api/media/…).
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
  })
}

/**
 * Wider allow-list for long-form CMS bodies (blog posts, About sections) that
 * may hold legacy rich markup pasted from Word/Docs — inline styling, `<b>`/
 * `<i>`, tables, headings h5/h6, etc. Still strips the actual XSS vectors:
 * `<script>`/`<style>`/`<iframe>`, event handlers, and `javascript:`/`data:`
 * URLs. Newly authored content comes from the shared editor and is already a
 * subset of this. Use `sanitizeHtml` (strict) for short "description" fields.
 */
const RICH_ALLOWED_TAGS = [
  ...ALLOWED_TAGS,
  "b", "i", "span", "sub", "sup", "small", "mark", "pre", "h5", "h6",
  "figure", "figcaption",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
]

const SAFE_STYLE: Record<string, RegExp[]> = {
  color: [/.*/],
  "background-color": [/.*/],
  "text-align": [/^(left|right|center|justify)$/],
  "font-weight": [/^(normal|bold|bolder|lighter|\d{3})$/],
  "font-style": [/^(normal|italic|oblique)$/],
  "font-size": [/^[\d.]+(px|pt|em|rem|%)$/],
  "text-decoration": [/^[a-z\s-]+$/],
  "line-height": [/^[\d.]+(px|pt|em|rem|%)?$/],
}

export function sanitizeRichHtml(html: string): string {
  if (!html) return ""
  return sanitize(html, {
    allowedTags: RICH_ALLOWED_TAGS,
    allowedAttributes: {
      a: [...ALLOWED_ATTR, "name"],
      img: ALLOWED_IMG_ATTR,
      "*": ["class", "id", "style", "colspan", "rowspan", "align", "width", "height"],
    },
    allowedStyles: { "*": SAFE_STYLE },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
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
