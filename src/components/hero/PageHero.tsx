import { Container } from "@/components/common/Container";
import { heroPadding } from "@/components/theme/sectionClasses";
import { cn } from "@/components/theme/cn";
import { PageHeroBackground } from "@/components/hero/PageHeroBackground";
import { PageHeroContent } from "@/components/hero/PageHeroContent";
import { PageHeroScrollIndicator } from "@/components/hero/PageHeroScrollIndicator";

export interface PageHeroProps {
  backgroundImage: string;
  badge?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  variant?: "centered" | "split" | "minimal";
  headingId?: string;
  minHeight?: string;
  children?: React.ReactNode;
  className?: string;
  /** Extra classes on the background image (e.g. projects-hero-media float). */
  imageClassName?: string;
  showRadialOverlay?: boolean;
  showScrollIndicator?: boolean;
}

export function PageHero({
  backgroundImage,
  badge,
  title,
  titleHighlight,
  description,
  variant = "centered",
  headingId,
  minHeight,
  children,
  className,
  imageClassName,
  showRadialOverlay = true,
  showScrollIndicator = false,
}: PageHeroProps) {
  const isMinimal = variant === "minimal";
  const isSplit = variant === "split";

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-hero-bg text-white",
        isMinimal ? "py-16 md:py-20" : heroPadding,
        minHeight,
        className
      )}
      aria-labelledby={headingId}
    >
      <PageHeroBackground
        backgroundImage={backgroundImage}
        imageClassName={imageClassName}
        showOverlay={!isMinimal}
      />

      {showRadialOverlay && !isMinimal && (
        <div
          className="page-hero-radial-overlay pointer-events-none absolute inset-0 z-10"
          aria-hidden
        />
      )}

      <Container className="relative z-20">
        <PageHeroContent
          badge={badge}
          title={title}
          titleHighlight={titleHighlight}
          description={description}
          headingId={headingId}
          isMinimal={isMinimal}
          isSplit={isSplit}
        >
          {children}
        </PageHeroContent>
      </Container>

      {showScrollIndicator && !isMinimal && <PageHeroScrollIndicator />}
    </section>
  );
}
