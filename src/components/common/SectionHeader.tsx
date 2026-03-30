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
  /** When false, hides the gradient bar under the title (e.g. inside a nested panel). */
  showAccentBar?: boolean;
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
  showAccentBar = true,
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
                  <span className="bg-gradient-to-br from-primary via-primary to-cta-gold bg-clip-text text-transparent">
                    {titleHighlight}
                  </span>
                )}
              </span>
            ))}
          </>
        );
      })()
    : title;

  return (
    <div className={cn(centered && "text-center", centered && "flex flex-col items-center")}>
      {subtitle &&
        (subtitleClassName || subtitlePill ? (
          <span
            className={cn(
              "mb-3 block text-sm font-semibold uppercase tracking-[0.14em]",
              subtitlePill &&
                "inline-block rounded-full border border-primary/10 bg-gradient-to-r from-primary/[0.11] via-primary/[0.07] to-primary/[0.11] px-4 py-1.5 shadow-sm shadow-primary/5 ring-1 ring-primary/10 backdrop-blur-sm",
              subtitleClassName
            )}
          >
            {subtitle}
          </span>
        ) : (
          <Text
            size="sm"
            color="muted"
            className="mb-3 uppercase tracking-[0.14em]"
          >
            {subtitle}
          </Text>
        ))}
      <Heading
        level={2}
        className={cn(
          "text-3xl tracking-tight text-foreground sm:text-4xl md:text-[2.5rem] lg:text-5xl",
          "mb-3 sm:mb-4",
          centered && "mx-auto max-w-4xl text-balance"
        )}
        id={headingId}
      >
        {titleContent}
      </Heading>
      {centered && showAccentBar && (
        <div
          className="mb-6 h-1 w-14 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 shadow-[0_0_24px_rgba(244,139,34,0.28)] sm:mb-7 sm:h-1.5 sm:w-16"
          aria-hidden
        />
      )}
      {description && (
        <Text
          size="lg"
          color="muted"
          className={cn(
            "max-w-2xl text-base leading-relaxed md:text-lg",
            centered && "mx-auto"
          )}
        >
          {description}
        </Text>
      )}
    </div>
  );
}
