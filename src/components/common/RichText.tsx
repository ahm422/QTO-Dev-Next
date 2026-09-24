import { cn } from "@/components/theme/cn"
import { cmsBodyNeedsRichText, prepareCmsHtml } from "@/lib/sanitize-html"

interface RichTextProps {
  html: string
  className?: string
  as?: "div" | "span"
}

/**
 * Renders a CMS body. `prepareCmsHtml` decodes escaped markup and markdown
 * links once, linkifies bare URLs, then sanitizes before
 * `dangerouslySetInnerHTML`. Plain sentences with no URL stay text nodes.
 */
export function RichText({ html, className, as = "div" }: RichTextProps) {
  if (!html) return null

  if (!cmsBodyNeedsRichText(html)) {
    const Plain = as === "span" ? "span" : "p"
    return <Plain className={className}>{html}</Plain>
  }

  const Comp = as
  return (
    <Comp
      className={cn("prose-style", className)}
      dangerouslySetInnerHTML={{ __html: prepareCmsHtml(html) }}
    />
  )
}
