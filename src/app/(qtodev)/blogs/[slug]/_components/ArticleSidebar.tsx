'use client';

import { useEffect, useState } from 'react';
import { BlogPost } from '@/types/blog';
import { TableOfContents } from './TableOfContents';
import { ShareButtons } from './ShareButtons';

interface ArticleSidebarProps {
  post: BlogPost;
}

export function ArticleSidebar({ post }: ArticleSidebarProps) {
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);

  useEffect(() => {
    // Extract headings from the rendered article content and ensure stable IDs
    const extractHeadings = () => {
      const articleContent = document.getElementById('article-content');
      if (!articleContent) return;

      const headingElements = articleContent.querySelectorAll('h2, h3');
      const idCounts = new Map<string, number>();

      const extracted = Array.from(headingElements).map((el) => {
        if (!el.id) {
          const rawText = el.textContent || '';
          const baseSlug =
            rawText
              .toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-') || 'section';

          const count = idCounts.get(baseSlug) ?? 0;
          idCounts.set(baseSlug, count + 1);

          const uniqueId = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
          el.id = uniqueId;
        }

        return {
          id: el.id,
          text: el.textContent || '',
          level: parseInt(el.tagName[1]),
        };
      });

      setHeadings(extracted);
    };

    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(extractHeadings, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="space-y-6">
      <div className="lg:sticky lg:top-24 space-y-6">
        {/* Table of Contents */}
        {headings.length > 0 && <TableOfContents headings={headings} />}

        {/* Share Options */}
        <ShareButtons slug={post.slug} title={post.title} variant="card" />
      </div>
    </aside>
  );
}
