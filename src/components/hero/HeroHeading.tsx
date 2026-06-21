import { heroConfig } from "@/config/hero";
import { cn } from "@/components/theme/cn";

interface HeroHeadingProps {
  readonly className?: string;
  readonly heading?: string;
  readonly headingHighlight?: string;
}

export function HeroHeading({ className, heading: headingProp, headingHighlight: highlightProp }: Readonly<HeroHeadingProps>) {
  const { heading: defaultHeading, headingHighlight: defaultHighlight } = heroConfig;
  const heading = headingProp ?? defaultHeading;
  const headingHighlight = highlightProp ?? defaultHighlight;
  const headingClasses = cn(
    "font-heading font-bold leading-[1.08] tracking-tight text-white",
    "text-[2.25rem] min-[400px]:text-4xl sm:text-5xl md:text-[3.25rem] lg:text-6xl xl:text-[4rem]",
    className
  );

  if (!headingHighlight) {
    return <h1 className={headingClasses}>{heading}</h1>;
  }

  return (
    <h1 className={headingClasses}>
      <span>{heading} </span>
      <span
        className="text-primary"
        style={{
          textShadow:
            "0 0 28px rgba(244, 139, 34, 0.5), 0 0 8px rgba(244, 139, 34, 0.3)",
        }}
      >
        {headingHighlight}
      </span>
    </h1>
  );
}
