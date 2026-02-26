import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { AppIcon, type AppIconName } from "@/components/ui/shared/AppIcon";
import { formatDateShort, truncateText } from "@/lib/format";
import { cn } from "@/components/theme/cn";

/** Map category to an icon for headline list thumbnail */
function getCategoryIcon(category: string): AppIconName {
  const lower = category.toLowerCase();
  if (lower.includes("cloud") || lower.includes("devops")) return "cloud";
  if (lower.includes("ai") || lower.includes("ml")) return "robot";
  if (lower.includes("performance") || lower.includes("analytics")) return "chart-line";
  if (lower.includes("design") || lower.includes("css")) return "palette";
  if (lower.includes("react") || lower.includes("web")) return "laptop-code";
  return "server";
}

interface HeadlinePostItemProps {
  post: BlogPost;
  titleMaxLength?: number;
}

export function HeadlinePostItem({ post, titleMaxLength = 50 }: HeadlinePostItemProps) {
  const iconName = getCategoryIcon(post.category);

  return (
    <li>
      <Link
        href={`/blogs/${post.slug}`}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border border-border bg-background",
          "hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "transition-colors"
        )}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary"
          aria-hidden
        >
          <AppIcon name={iconName} size="sm" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-xs text-foreground-muted uppercase tracking-wide">
            {post.category}
          </span>
          <span className="text-xs text-foreground-muted mx-2">·</span>
          <span className="text-xs text-foreground-muted">
            {formatDateShort(post.publishedAt)}
          </span>
          <p className="text-sm font-medium text-foreground mt-0.5 truncate">
            {truncateText(post.title, titleMaxLength)}
          </p>
        </div>
        <AppIcon name="arrow-right" size="sm" className="shrink-0 text-foreground-muted" />
      </Link>
    </li>
  );
}
