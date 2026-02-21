interface MDXRendererProps {
  content: string;
}

export function MDXRenderer({ content }: MDXRendererProps) {
  // This is a simple HTML renderer. For full MDX support, integrate @next/mdx or next-mdx-remote
  return (
    <div
      className="prose prose-inherit max-w-none [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:mb-6 [&_li]:mb-2 [&_ul]:mb-6 [&_ol]:mb-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground-muted [&_blockquote]:my-6 [&_table]:mb-6 [&_th]:bg-surface-muted [&_th]:p-3 [&_td]:p-3 [&_tr]:border-b [&_tr]:border-border"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
