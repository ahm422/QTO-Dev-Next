'use client';

import { useState } from 'react';

interface SidebarShareButtonsProps {
  slug: string;
}

export function SidebarShareButtons({ slug }: SidebarShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/blogs/${slug}`
      : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Check%20this%20out&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="bg-surface p-4 rounded-lg border border-border flex flex-col items-center gap-3">
      <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">
        Share
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleCopyLink}
          className="p-3 bg-background border border-border rounded-lg hover:bg-surface-muted transition-colors"
          title="Copy link"
          aria-label="Copy link to article"
        >
          {copied ? (
            <span className="text-lg">✓</span>
          ) : (
            <svg
              className="w-5 h-5 text-foreground-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          )}
        </button>

        <button
          onClick={shareOnTwitter}
          className="p-3 bg-background border border-border rounded-lg hover:bg-surface-muted transition-colors"
          title="Share on Twitter/X"
          aria-label="Share on Twitter"
        >
          <svg
            className="w-5 h-5 text-foreground-muted"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 8-1 8-5.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
          </svg>
        </button>

        <button
          onClick={shareOnLinkedIn}
          className="p-3 bg-background border border-border rounded-lg hover:bg-surface-muted transition-colors"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <svg
            className="w-5 h-5 text-foreground-muted"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
            <circle cx={4} cy={4} r={2} />
          </svg>
        </button>
      </div>
    </div>
  );
}
