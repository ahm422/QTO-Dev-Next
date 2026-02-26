import { cn } from "@/components/theme/cn";
import { Heading } from "@/components/ui/shared/Heading";
import { Text } from "@/components/ui/shared/Text";

interface SectionHeaderProps {
  title: string;
  /** When set, this word within title is wrapped in a span with text-primary */
  titleHighlight?: string;
  description?: string;
  subtitle?: string;
  /** Optional class for the subtitle wrapper (e.g. text-primary for gold label) */
  subtitleClassName?: string;
  /** When true, render subtitle as a pill (rounded-full, bg-primary/10) */
  subtitlePill?: boolean;
  centered?: boolean;
  /** Optional id for the heading (e.g. for aria-labelledby on the section) */
  headingId?: string;
}

export function SectionHeader({
  title,
  titleHighlight,
  description,
  subtitle,
  subtitleClassName,
  subtitlePill,
  centered = true,
  headingId,
}: SectionHeaderProps) {
  const titleContent = titleHighlight
    ? (() => {
        const parts = title.split(titleHighlight);
        return (
          <>
            {parts.map((part, i) => (
              <span key={i}>
                {part}
                {i < parts.length - 1 && (
                  <span className="text-primary">{titleHighlight}</span>
                )}
              </span>
            ))}
          </>
        );
      })()
    : title;

  return (
    <div className={centered ? "text-center" : ""}>
      {subtitle &&
        (subtitleClassName || subtitlePill ? (
          <span
            className={cn(
              "text-sm uppercase tracking-wide mb-2 block",
              subtitlePill && "inline-block rounded-full px-3 py-1.5 bg-primary/10",
              subtitleClassName
            )}
          >
            {subtitle}
          </span>
        ) : (
          <Text size="sm" color="muted" className="uppercase tracking-wide mb-2">
            {subtitle}
          </Text>
        ))}
      <Heading level={2} className="mb-4" id={headingId}>
        {titleContent}
      </Heading>
      {description && (
        <Text
          size="lg"
          color="muted"
          className={cn("max-w-2xl", centered && "mx-auto")}
        >
          {description}
        </Text>
      )}
    </div>
  );
}
