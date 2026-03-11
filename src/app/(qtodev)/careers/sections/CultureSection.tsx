"use client";

import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { careersPageConfig } from "@/config/careersPage";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "culture-heading";

export function CultureSection() {
  const { culture } = careersPageConfig;
  const [smallTeams, biasTowardShipping, respectfulCollab] = culture.highlights ?? [];

  return (
    <section
      className="relative py-20 md:py-28 bg-background"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary/8 via-primary/4 to-transparent"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-start" data-reveal>
            <div>
              <SectionHeader
                subtitle={culture.subtitle}
                subtitleClassName="text-primary font-semibold tracking-widest"
                subtitlePill
                title={culture.title}
                titleHighlight={culture.titleHighlight}
                description={culture.description}
                headingId={HEADING_ID}
                centered={false}
              />
            </div>

            <div
              className={cn(
                "relative rounded-3xl border border-border/80 bg-surface-muted/80",
                "shadow-lg shadow-black/10 p-4 sm:p-5 lg:p-6 overflow-hidden"
              )}
              data-reveal
            >
              <div
                className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-0 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
                aria-hidden
              />

              <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                <div className="col-span-2 lg:col-span-1 lg:row-span-2">
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-background/90 border border-border/70">
                    <Image
                      src="/images/ITTeam.JPG"
                      alt="QTO Dev engineering team collaborating in the office"
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm shadow-black/10">
                        {smallTeams?.title ?? "Small, senior-heavy teams"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-background/90 border border-border/70">
                    <Image
                      src="/images/Backend1.JPG"
                      alt="Backend team focused on building and shipping features"
                      fill
                      sizes="(min-width: 1024px) 220px, (min-width: 768px) 40vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm shadow-black/10">
                        {biasTowardShipping?.title ?? "Bias toward shipping"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <div className="group relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 border border-primary/30">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.12),transparent_55%)]" />
                    <div className="relative flex flex-col items-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/40">
                        <span
                          className="ml-0.5 inline-block border-y-[6px] border-l-[10px] border-y-transparent border-l-primary-foreground"
                          aria-hidden
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          Culture in Motion
                        </p>
                        <p className="text-sm text-foreground-muted">
                          Short clips from team events and day-to-day collaborations.
                        </p>
                      </div>
                      <p className="text-[11px] text-foreground-muted/80">
                        Ask us for a walkthrough when we chat.
                      </p>
                    </div>
                    <span className="sr-only">
                      Placeholder tile representing QTO Dev culture videos and event moments.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

