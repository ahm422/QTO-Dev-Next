'use client';

import { useState } from 'react';
import { AppIcon } from '@/components/ui/shared/AppIcon';
import { cn } from '@/components/theme/cn';

interface ShareButtonsProps {
  slug: string;
  title?: string;
  className?: string;
  variant?: 'inline' | 'card';
}

export function ShareButtons({
  slug,
  title,
  className = '',
  variant = 'inline',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/blogs/${slug}`
      : '';

  const handleCopyLink = async () => {
    try {
      if (!shareUrl) return;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnTwitter = () => {
    if (!shareUrl) return;
    const text = title || 'Check out this article';
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareOnLinkedIn = () => {
    if (!shareUrl) return;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      '_blank'
    );
  };

  const isCard = variant === 'card';

  const containerClasses = isCard
    ? cn(
        'bg-surface p-4 rounded-lg border border-border flex flex-col gap-3',
        className
      )
    : cn('flex items-center gap-3', className);

  const buttonsRowClasses = isCard
    ? 'flex justify-center gap-3'
    : 'flex items-center gap-3';

  return (
    <section className={containerClasses} aria-label="Share this article">
      {isCard && (
        <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide text-center">
          Share
        </p>
      )}
      <div className={buttonsRowClasses}>
        <button
          onClick={handleCopyLink}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg transition-colors',
            isCard
              ? 'px-3 py-2 bg-background border border-border hover:bg-surface-muted text-xs font-medium'
              : 'px-2 py-1 hover:bg-surface-muted'
          )}
          title="Copy link"
          aria-label="Copy link to article"
        >
          <AppIcon
            name={copied ? 'circle-check' : 'link'}
            size="sm"
            className={copied ? 'text-success' : 'text-foreground-muted'}
          />
          <span className="text-xs font-medium">
            {copied ? 'Copied' : 'Copy link'}
          </span>
        </button>

        <button
          onClick={shareOnTwitter}
          className={cn(
            'flex items-center justify-center rounded-lg border border-border hover:bg-surface-muted transition-colors',
            isCard ? 'p-3 bg-background' : 'p-2'
          )}
          title="Share on X (Twitter)"
          aria-label="Share on X (Twitter)"
        >
          <AppIcon
            name="x-twitter"
            size="sm"
            className="text-foreground-muted"
          />
        </button>

        <button
          onClick={shareOnLinkedIn}
          className={cn(
            'flex items-center justify-center rounded-lg border border-border hover:bg-surface-muted transition-colors',
            isCard ? 'p-3 bg-background' : 'p-2'
          )}
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <AppIcon
            name="linkedin-in"
            size="sm"
            className="text-foreground-muted"
          />
        </button>
      </div>
    </section>
  );
}
