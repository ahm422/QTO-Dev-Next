import { sanitizeRichHtml, isHtmlBody, wrapTables } from "@/lib/sanitize-html";

interface MDXRendererProps {
  content: string;
}

export function MDXRenderer({ content }: MDXRendererProps) {
  // CMS-authored HTML — sanitized before render to prevent stored XSS. The
  // wider `sanitizeRichHtml` profile preserves legacy Word/Docs markup
  // (inline styles, <b>/<i>, tables) while stripping scripts/handlers.
  const html = isHtmlBody(content)
    ? wrapTables(sanitizeRichHtml(content))
    : `<p>${content}</p>`;
  return (
    <div
      id="article-content"
      // Table + link styling now lives in `.prose-style` (globals.css) so it
      // stays consistent with the shared RichText renderer and both themes.
      className="prose-style [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:mb-6 [&_li]:mb-2 [&_ul]:mb-6 [&_ol]:mb-6 [&_ul_ul]:mt-2 [&_ol_ol]:mt-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground-muted [&_blockquote]:my-6 [&_h2]:scroll-mt-28 [&_h3]:scroll-mt-28 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6 [&_strong]:font-semibold [&_em]:italic [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface-muted [&_pre]:p-4 [&_pre]:my-6 [&_code]:rounded [&_code]:bg-surface-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
