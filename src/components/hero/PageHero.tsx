import Image from "next/image";
import { Container } from "@/components/common/Container";
import { heroPadding } from "@/components/theme/sectionClasses";
import { cn } from "@/components/theme/cn";
import { Heading } from "@/components/ui/shared/Heading";

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
}

function renderTitle(title: string, titleHighlight?: string) {
  if (!titleHighlight) return title;

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
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className={cn("object-cover", imageClassName)}
        />
        {!isMinimal && <div className="absolute inset-0 page-hero-image-bg" aria-hidden />}
      </div>

      {showRadialOverlay && !isMinimal && (
        <div
          className="page-hero-radial-overlay pointer-events-none absolute inset-0 z-10"
          aria-hidden
        />
      )}

      <Container className="relative z-20">
        {isSplit ? (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              {badge && (
                <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 animate-hero-content-fade animation-fill-backwards">
                  {badge}
                </span>
              )}
              <Heading
                id={headingId}
                level={1}
                className="mb-6 font-heading tracking-tight text-white animate-hero-content-fade animation-fill-backwards"
              >
                {renderTitle(title, titleHighlight)}
              </Heading>
              {description && (
                <p className="max-w-xl text-lg text-white/90 leading-relaxed md:text-xl animation-delay-150 animate-hero-content-fade animation-fill-backwards">
                  {description}
                </p>
              )}
            </div>
            {children ? <div className="w-full">{children}</div> : null}
          </div>
        ) : (
          <div
            className={cn(
              "mx-auto flex max-w-2xl flex-col items-center text-center",
              isMinimal && "max-w-3xl"
            )}
          >
            {badge && (
              <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 animate-hero-content-fade animation-fill-backwards">
                {badge}
              </span>
            )}
            <Heading
              id={headingId}
              level={1}
              className="mb-6 font-heading tracking-tight text-white animate-hero-content-fade animation-fill-backwards"
            >
              {renderTitle(title, titleHighlight)}
            </Heading>
            {description && (
              <p
                className={cn(
                  "max-w-xl text-white/90 leading-relaxed animation-delay-150 animate-hero-content-fade animation-fill-backwards",
                  isMinimal ? "text-lg md:text-xl" : "text-xl md:text-2xl"
                )}
              >
                {description}
              </p>
            )}
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
