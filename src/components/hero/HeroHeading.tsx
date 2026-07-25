import { heroConfig } from "@/config/hero";
import { cn } from "@/components/theme/cn";

interface HeroHeadingProps {
  readonly className?: string;
  readonly heading?: string;
  readonly headingHighlight?: string;
}

/**
 * Length-aware wrap control (issue #376). Thresholds are estimated from the
 * hero type scale: ~26 bold chars fit the full-width column at sm–md, and
 * ~15 chars fit the narrow lg left column on one line.
 */
/** Longest phrase that can be safely forced onto one line from sm up. */
const NOWRAP_MAX_CHARS = 22;
/** Combined copy shorter than this fits one desktop line — skip stacking. */
const STACK_MIN_TOTAL_CHARS = 16;

/**
 * Same-color phrases stay together from sm–md when short enough to fit the
 * full-width column; longer taglines wrap naturally instead of overflowing.
 * At lg+ each tone becomes its own block (wrap only at the tone boundary)
 * unless the whole heading is short enough for a single line.
 */
function phraseGroupClass(text: string, stackOnDesktop: boolean): string {
  return cn(
    text.length <= NOWRAP_MAX_CHARS && "max-sm:whitespace-normal sm:whitespace-nowrap",
    stackOnDesktop && "lg:block lg:whitespace-normal"
  );
}

export function HeroHeading({
  className,
  heading: headingProp,
  headingHighlight: highlightProp,
}: Readonly<HeroHeadingProps>) {
  const { heading: defaultHeading, headingHighlight: defaultHighlight } = heroConfig;
  const heading = headingProp ?? defaultHeading;
  const headingHighlight = highlightProp ?? defaultHighlight;
  const headingClasses = cn(
    "font-heading font-bold leading-[1.08] tracking-tighter text-white text-balance",
    "text-[2.25rem] min-[400px]:text-4xl sm:text-5xl md:text-[3.25rem] lg:text-6xl xl:text-[4rem]",
    className
  );

  if (!headingHighlight) {
    return <h1 className={headingClasses}>{heading}</h1>;
  }

  const stackOnDesktop =
    heading.length + headingHighlight.length + 1 > STACK_MIN_TOTAL_CHARS;

  return (
    <h1 className={headingClasses}>
      <span className={phraseGroupClass(heading, stackOnDesktop)}>{heading} </span>
      <span
        className={cn(
          "hero-heading-highlight bg-gradient-to-br from-primary via-primary to-cta-gold bg-clip-text text-transparent",
          phraseGroupClass(headingHighlight, stackOnDesktop)
        )}
      >
        {headingHighlight}
      </span>
    </h1>
  );
}
