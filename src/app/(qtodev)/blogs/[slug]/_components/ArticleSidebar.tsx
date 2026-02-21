'use client';

import { useEffect, useState } from 'react';
import { BlogPost } from '@/types/blog';
import { TableOfContents } from './TableOfContents';
import { NewsletterSignup } from './NewsletterSignup';
import { SidebarShareButtons } from './SidebarShareButtons';

interface ArticleSidebarProps {
  post: BlogPost;
}

export function ArticleSidebar({ post }: ArticleSidebarProps) {
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);

  useEffect(() => {
    // Extract headings from the DOM
    const extractHeadings = () => {
      const articleContent = document.querySelector('article');
      if (!articleContent) return;

      const headingElements = articleContent.querySelectorAll('h2, h3');
      const extracted = Array.from(headingElements).map((el, idx) => ({
        id: el.id || `heading-${idx}`,
        text: el.textContent || '',
        level: parseInt(el.tagName[1]),
      }));

      setHeadings(extracted);
    };

    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(extractHeadings, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="space-y-6">
      {/* Listen to Article Button */}
      <div className="sticky top-24 space-y-6">
        <button
          className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
          title="Listen to this article"
          aria-label="Listen to article"
        >
          <span>🎧</span>
          Listen to Article
        </button>

        {/* Newsletter Signup */}
        <NewsletterSignup />

        {/* Table of Contents */}
        {headings.length > 0 && <TableOfContents headings={headings} />}

        {/* Share Options */}
        <SidebarShareButtons slug={post.slug} />
      </div>
    </aside>
  );
}
