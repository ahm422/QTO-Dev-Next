import sanitize from "sanitize-html"

import { SITE_URL } from "@/lib/constants"

/**
 * Tags/attributes allowed out of the admin RichTextEditor. Keep this in sync
 * with three things, which must always agree:
 *   - the toolbar + `extensions` array in `src/components/ui/rich-text-editor.tsx`
 *   - the `.tiptap` editor CSS and the public `.prose-style` CSS in `globals.css`
 * Anything the editor can produce must be allow-listed here, and nothing else.
 *
 * `span`/`mark` + a narrow inline-style map (`STRICT_SAFE_STYLE`) carry the
 * toolbar's text-colour / highlight marks; the `table*` tags carry the table
 * tool. Alignment rides in as `text-align` on the cell's `<p>`/`<h*>`.
 */
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "code",
  "ul", "ol", "li",
  "a",
  "h1", "h2", "h3", "h4",
  "blockquote", "hr",
  "img",
  "span", "mark",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
]

const ALLOWED_ATTR = ["href", "target", "rel"]

/**
 * Attributes tolerated on any tag in the strict profile: the structural table
 * attributes plus `class`/`style` (the latter filtered down to
 * `STRICT_SAFE_STYLE`). `id` is deliberately omitted — the editor never emits
 * one and it invites anchor-jacking / duplicate-id bugs on the public page.
 */
const STRICT_WILDCARD_ATTR = ["class", "style", "colspan", "rowspan", "scope"]

/**
 * Hosts that count as "our own site" for link handling — internal links stay
 * dofollow, open in the same tab, and carry no `rel`. Derived from `SITE_URL`
 * (plus the `www.`/apex counterpart) with the production apex hard-coded as a
 * fallback for environments where the env var points at a preview domain.
 */
const INTERNAL_HOSTS: ReadonlySet<string> = (() => {
  const hosts = new Set<string>(["qtodev.com", "www.qtodev.com"])
  try {
    const host = new URL(SITE_URL).hostname.toLowerCase()
    hosts.add(host)
    hosts.add(host.startsWith("www.") ? host.slice(4) : `www.${host}`)
  } catch {
    /* SITE_URL misconfigured — fall back to the hard-coded apex above */
  }
  return hosts
})()

/** rel tokens that suppress link equity — stripped from every authored link so
 * internal and outbound links are dofollow (see issue: CMS links must pass
 * equity; a per-link nofollow/sponsored/ugc toggle is a possible follow-up). */
const EQUITY_BLOCKING_REL = /^(nofollow|sponsored|ugc)$/i

function isInternalHref(href: string): boolean {
  if (!href) return false
  if (href.startsWith("#")) return true
  if (href.startsWith("/") && !href.startsWith("//")) return true
  try {
    const url = new URL(href)
    if (url.protocol !== "http:" && url.protocol !== "https:") return false
    return INTERNAL_HOSTS.has(url.hostname.toLowerCase())
  } catch {
    return false
  }
}

/**
 * `transformTags` hook for `<a>`, shared by both sanitiser profiles. Runs during
 * parsing (before attribute/scheme filtering), so it edits `attribs` in place:
 *
 * - drops `nofollow`/`sponsored`/`ugc` from `rel` (links must be dofollow),
 * - internal links (relative, `#…`, or an `INTERNAL_HOSTS` host) → same tab,
 *   no `rel`,
 * - external `http(s)` links → `target="_blank"` + `rel="noopener noreferrer"`,
 * - `mailto:` / `tel:` links are left as authored,
 * - strips inline `color` / `text-decoration` so link styling is owned by CSS,
 *   not by colour pasted in from Word/Google Docs markup.
 */
function transformAnchor(tagName: string, attribs: sanitize.Attributes): sanitize.Tag {
  const next: sanitize.Attributes = { ...attribs }

  if (next.style) {
    const cleaned = next.style
      .split(";")
      .map((decl) => decl.trim())
      .filter((decl) => decl && !/^(color|text-decoration[a-z-]*)\s*:/i.test(decl))
      .join("; ")
    if (cleaned) next.style = cleaned
    else delete next.style
  }

  const href = (next.href ?? "").trim()
  const relTokens = (next.rel ?? "")
    .split(/\s+/)
    .filter((token) => token && !EQUITY_BLOCKING_REL.test(token))

  if (/^(mailto:|tel:)/i.test(href)) {
    if (relTokens.length) next.rel = relTokens.join(" ")
    else delete next.rel
    return { tagName, attribs: next }
  }

  if (isInternalHref(href)) {
    delete next.target
    delete next.rel
  } else if (/^https?:\/\//i.test(href)) {
    next.target = "_blank"
    const rel = new Set(relTokens.map((token) => token.toLowerCase()))
    rel.add("noopener")
    rel.add("noreferrer")
    next.rel = [...rel].join(" ")
  } else if (relTokens.length) {
    next.rel = relTokens.join(" ")
  } else {
    delete next.rel
  }

  return { tagName, attribs: next }
}

/** Attributes kept on <img> — the editor's Image button emits src/alt; the
 * rest are tolerated on pasted markup. `src` schemes are further restricted
 * to https + root-relative below (media is served from R2 over https, or the
 * dev `/api/media/...` proxy). */
const ALLOWED_IMG_ATTR = ["src", "alt", "title", "width", "height", "loading"]

/**
 * Sanitizes HTML produced by the admin RichTextEditor before it is rendered
 * on the public site via `dangerouslySetInnerHTML`, to prevent stored-XSS
 * from admin-authored (or legacy/plain-text) content.
 *
 * `span`/`mark` carry the toolbar's text-colour + highlight marks and the
 * table tags carry the table tool; both are filtered hard — only the four
 * declarations in `STRICT_SAFE_STYLE` survive on `style`, empty wrappers are
 * dropped (`isEmptyWrapper`), and `transformAnchor` still strips `style` off
 * every `<a>`.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ""
  return sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ALLOWED_ATTR,
      img: ALLOWED_IMG_ATTR,
      "*": STRICT_WILDCARD_ATTR,
    },
    transformTags: { a: transformAnchor },
    allowedStyles: { "*": STRICT_SAFE_STYLE },
    exclusiveFilter: isEmptyWrapper,
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
  "b", "i", "sub", "sup", "small", "pre", "h5", "h6",
  "figure", "figcaption",
]

/**
 * Word / Google Docs stamp every run with an explicit near-black `color`
 * (`black`, `windowtext`, `#000`, `rgb(0,0,0)`). Kept as-is, that text is
 * invisible on the dark theme — most visibly in table header cells, whose
 * `<b><span style="color:black">` beats the themed cell colour. Rejecting just
 * those values drops the declaration (the element then inherits the themed
 * colour) while any real authored colour is preserved.
 */
const NON_BLACK_COLOR =
  /^(?!\s*(?:black|windowtext|#0{3}|#0{6}|rgba?\(\s*0\s*,\s*0\s*,\s*0\s*(?:,\s*1(?:\.0+)?\s*)?\))\s*$)/i

const SAFE_STYLE: Record<string, RegExp[]> = {
  color: [NON_BLACK_COLOR],
  "background-color": [/.*/],
  "text-align": [/^(left|right|center|justify)$/],
  "font-weight": [/^(normal|bold|bolder|lighter|\d{3})$/],
  "font-style": [/^(normal|italic|oblique)$/],
  "font-size": [/^[\d.]+(px|pt|em|rem|%)$/],
  "text-decoration": [/^[a-z\s-]+$/],
  "line-height": [/^[\d.]+(px|pt|em|rem|%)?$/],
}

/**
 * The only inline-style declarations the strict profile keeps — the toolbar's
 * text-colour (`<span style="color:…">`) and highlight
 * (`<span style="background-color:…">`) marks, plus per-cell `text-align`. Near-
 * black colours are rejected the same way as in `SAFE_STYLE` so pasted Word
 * runs can't force invisible text; `font-*` / `line-height` are intentionally
 * absent (short `description` fields don't need Word's typographic noise).
 */
const STRICT_SAFE_STYLE: Record<string, RegExp[]> = {
  color: [NON_BLACK_COLOR],
  "background-color": [NON_BLACK_COLOR],
  "text-align": [/^(left|right|center|justify)$/],
  "text-decoration": [/^[a-z\s-]+$/],
}

/**
 * Word leaves empty inline wrappers and — inside table cells — whole empty
 * layout tables (`<table class="MsoNormalTable"><tr><td></td></tr></table>`)
 * plus `&nbsp;`-only `<p>` spacers ahead of the real content. Left in, they
 * occupy layout space and push a header cell's text below its neighbours
 * (misaligned column headers). Drop any of these wrappers that carry no text
 * and no media. `td`/`tr` are deliberately excluded so a genuinely empty data
 * cell can't collapse and shift a real table's columns — an empty nested
 * layout table is still removed whole via its `tbody`/`table`.
 */
const EMPTY_STRIPPABLE: ReadonlySet<string> = new Set([
  "p", "span", "b", "i", "strong", "em", "u", "s", "small", "sub", "sup", "mark",
  "figcaption", "table", "thead", "tbody",
])

function isEmptyWrapper(frame: { tag: string; text: string; mediaChildren?: unknown[] }): boolean {
  if (!EMPTY_STRIPPABLE.has(frame.tag)) return false
  if (frame.mediaChildren && frame.mediaChildren.length > 0) return false
  return !frame.text || !frame.text.trim()
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
    transformTags: { a: transformAnchor },
    allowedStyles: { "*": SAFE_STYLE },
    exclusiveFilter: isEmptyWrapper,
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

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

/** Matches a bare `http(s)://…` or `www.…` run up to the next whitespace/`<`. */
const BARE_URL = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi

/**
 * Turns one matched bare-URL run into an `<a>`. Trailing sentence punctuation is
 * kept outside the anchor and `www.` hosts get an `https://` href. `escape`
 * controls whether the visible label/trailing text is HTML-escaped: `true` when
 * the surrounding string is plain text, `false` when it is already an HTML text
 * node (the editor has escaped it) so we don't double-escape.
 */
function wrapBareUrl(raw: string, escape: boolean): string {
  let url = raw
  let trailing = ""
  const trailingMatch = url.match(/[.,;:!?)\]}'"]+$/)
  if (trailingMatch) {
    trailing = url.slice(url.length - trailingMatch[0].length)
    url = url.slice(0, url.length - trailingMatch[0].length)
  }
  const href = url.toLowerCase().startsWith("www.") ? `https://${url}` : url
  const label = escape ? escapeHtml(url) : url
  const trail = escape ? escapeHtml(trailing) : trailing
  return `<a href="${escapeHtml(href)}">${label}</a>${trail}`
}

/**
 * Wraps bare `http(s)://…` / `www.…` URLs in an otherwise plain-text string with
 * `<a>` tags, HTML-escaping everything else. Used by `<RichText>` for legacy
 * plain-text `description` rows so authored URLs become styled, clickable links
 * without a data migration. The result is still passed through `sanitizeHtml`,
 * which owns rel/target/dofollow normalisation (see `transformAnchor`). Trailing
 * sentence punctuation is kept outside the anchor; `www.` hosts get an `https://`
 * href.
 */
export function linkifyPlainText(text: string): string {
  if (!text) return ""
  const urlPattern = new RegExp(BARE_URL.source, "gi")
  let result = ""
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = urlPattern.exec(text)) !== null) {
    result += escapeHtml(text.slice(lastIndex, match.index))
    result += wrapBareUrl(match[0], true)
    lastIndex = match.index + match[0].length
  }
  result += escapeHtml(text.slice(lastIndex))
  return result
}

/**
 * Linkifies bare URLs that sit in the *text nodes* of an HTML string — i.e.
 * content authored in `RichTextEditor` where the user typed a URL but never
 * pressed the toolbar Link button. URLs already inside an `<a>` (or anywhere in
 * a tag) are left untouched. The result is still passed through `sanitizeHtml`,
 * which owns rel/target/dofollow normalisation and brand styling, so a typed
 * URL renders identically to one added via the Link button.
 */
export function linkifyHtml(html: string): string {
  if (!html || !/(https?:\/\/|www\.)/i.test(html)) return html
  let anchorDepth = 0
  return html.replace(/<[^>]+>|[^<]+/g, (token) => {
    if (token[0] === "<") {
      if (/^<a[\s>]/i.test(token)) anchorDepth++
      else if (/^<\/a\s*>/i.test(token)) anchorDepth = Math.max(0, anchorDepth - 1)
      return token
    }
    if (anchorDepth > 0) return token
    return token.replace(new RegExp(BARE_URL.source, "gi"), (m) => wrapBareUrl(m, false))
  })
}

/**
 * Wraps every `<table>` in a horizontal-scroll container so wide multi-column
 * tables scroll on mobile instead of overflowing the page. Run this only on
 * already-sanitised markup (post `sanitizeHtml` / `sanitizeRichHtml`) — it does
 * a plain string replace and trusts its input. Used by both public renderers
 * (`RichText`, `MDXRenderer`); `.prose-style` styles the `.overflow-x-auto`
 * wrapper.
 */
export function wrapTables(html: string): string {
  if (!html || !html.includes("<table")) return html
  return html
    .replace(/<table(\s|>)/g, '<div class="overflow-x-auto"><table$1')
    .replace(/<\/table>/g, "</table></div>")
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
