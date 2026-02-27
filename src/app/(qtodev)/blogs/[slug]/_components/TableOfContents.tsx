'use client';

import { useEffect, useState } from 'react';
import { AppIcon } from '@/components/ui/shared/AppIcon';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
    }
  };

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries.filter((entry) => entry.isIntersecting);
        if (!visibleHeadings.length) return;

        const topMost = visibleHeadings.reduce((prev, current) =>
          prev.target.getBoundingClientRect().top <
          current.target.getBoundingClientRect().top
            ? prev
            : current
        );

        setActiveId((topMost.target as HTMLElement).id);
      },
      {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      className="bg-surface p-4 rounded-lg border border-border lg:sticky lg:top-24"
      aria-label="Table of contents"
    >
      <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
        <AppIcon name="list" size="sm" className="text-primary" />
        On This Page
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
          >
            <button
              onClick={() => handleScroll(heading.id)}
              className={`hover:text-primary transition-colors text-left block w-full ${
                activeId === heading.id
                  ? 'text-primary font-semibold'
                  : 'text-foreground-muted'
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
