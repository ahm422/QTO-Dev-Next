import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { aboutPageConfig } from "@/config/aboutPage";

const HEADING_ID = "about-hero-heading";

export function AboutHeroSection() {
  const { hero } = aboutPageConfig;

  return (
    <section
      className="relative flex items-center py-24 md:py-32 lg:py-36 bg-primary text-primary-foreground overflow-hidden min-h-[70vh]"
      aria-labelledby={HEADING_ID}
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 z-0 page-hero-image-bg about-hero-bg"
        aria-hidden
      />

      {/* Rich gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(ellipse 70% 50% at 80% 80%, rgba(255,255,255,0.06) 0%, transparent 45%), radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,0,0,0.03) 0%, transparent 60%)",
        }}
      />

      <Container className="relative z-20">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {"pageHeading" in hero && hero.pageHeading && (
            <p className="text-white/80 text-sm uppercase tracking-widest mb-3 font-medium animate-hero-content-fade animation-fill-backwards">
              {hero.pageHeading}
            </p>
          )}
          <Heading
            id={HEADING_ID}
            level={1}
            className="text-white mb-6 font-heading tracking-tight animate-hero-content-fade animation-fill-backwards"
          >
            {hero.heading}
          </Heading>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-lg mx-auto animation-delay-150 animate-hero-content-fade animation-fill-backwards">
            {hero.subhead}
          </p>
          <Link
            href={hero.ctaHref}
            className={cn(
              "group inline-flex items-center gap-3 font-semibold rounded-xl transition-all duration-300",
              "px-7 py-3.5 text-lg",
              "bg-white text-black hover:bg-white/95",
              "shadow-xl shadow-black/15 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
              "animation-delay-300 animate-hero-content-fade animation-fill-backwards"
            )}
          >
            {hero.ctaText}
            <AppIcon
              name="arrow-right"
              size="sm"
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
