'use client';

import { useState } from 'react';

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

  if (headings.length === 0) return null;

  return (
    <nav
      className="bg-surface p-4 rounded-lg border border-border sticky top-24"
      aria-label="Table of contents"
    >
      <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wide">
        📑 On This Page
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
