import { Heading } from "@/components/ui/shared/Heading";
import { Text } from "@/components/ui/shared/Text";

interface SectionHeaderProps {
  title: string;
  /** When set, this word within title is wrapped in a span with text-primary */
  titleHighlight?: string;
  description?: string;
  subtitle?: string;
  centered?: boolean;
  /** Optional id for the heading (e.g. for aria-labelledby on the section) */
  headingId?: string;
}

export function SectionHeader({
  title,
  titleHighlight,
  description,
  subtitle,
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
      {subtitle && (
        <Text size="sm" color="muted" className="uppercase tracking-wide mb-2">
          {subtitle}
        </Text>
      )}
      <Heading level={2} className="mb-4" id={headingId}>
        {titleContent}
      </Heading>
      {description && (
        <Text size="lg" color="muted" className="max-w-2xl mx-auto">
          {description}
        </Text>
      )}
    </div>
  );
}
