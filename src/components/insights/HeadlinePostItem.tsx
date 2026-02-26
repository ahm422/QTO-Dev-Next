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
    <Link
        href={`/blogs/${post.slug}`}
        className={cn(
          "relative flex items-center gap-4 p-4 rounded-xl border bg-background",
          "border-border hover:border-primary/25 hover:bg-primary/[0.04]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "transition-all duration-200",
          "group"
        )}
      >
        {/* Left accent on hover */}
        <span
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          )}
          aria-hidden
        />
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary/15 group-hover:border-primary/30 transition-colors"
          aria-hidden
        >
          <AppIcon name={iconName} size="sm" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
            <span className="uppercase tracking-wide font-medium">{post.category}</span>
            <span>·</span>
            <span>{formatDateShort(post.publishedAt)}</span>
          </div>
          <p className="text-sm font-semibold text-foreground mt-1 truncate group-hover:text-primary transition-colors">
            {truncateText(post.title, titleMaxLength)}
          </p>
        </div>
        <AppIcon name="arrow-right" size="sm" className="shrink-0 text-foreground-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </Link>
  );
}
