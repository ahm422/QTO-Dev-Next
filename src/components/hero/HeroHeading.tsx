import { heroConfig } from "@/config/hero";
import { cn } from "@/components/theme/cn";
import {
  phraseGroupClass,
  shouldStackOnDesktop,
} from "@/components/hero/heroHeadingWrap";

interface HeroHeadingProps {
  readonly className?: string;
  readonly heading?: string;
  readonly headingHighlight?: string;
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

  const stackOnDesktop = shouldStackOnDesktop(heading, headingHighlight);

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
