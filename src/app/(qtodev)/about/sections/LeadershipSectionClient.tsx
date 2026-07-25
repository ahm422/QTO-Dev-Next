"use client";

import Image from "next/image";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { InteractiveImage } from "@/components/animations/InteractiveImage";
import { TiltCard } from "@/components/animations/TiltCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/components/theme/cn";
import type { LeadershipMember } from "@/types/leadership";
import { staticImageUrl } from "@/config/staticImages";

const HEADING_ID = "about-leadership-heading";
const IT_TEAM_IMAGE = staticImageUrl("/images/it-team-2.JPG");
const IT_TEAM_ALT = "QTO DEV IT team at QTO House";

export function LeadershipSectionClient({
  team,
}: {
  readonly team: LeadershipMember[];
}) {
  if (team.length === 0) return null;

  const itTeam = team.find((member) => member.id === "it-team");
  const gridTeam = team.filter((member) => member.id !== "it-team");
  const heroImage = itTeam?.imageUrl ?? IT_TEAM_IMAGE;
  const heroAlt = itTeam?.name ? `${itTeam.name} at QTO House` : IT_TEAM_ALT;

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/5 via-surface to-surface-muted border-y border-border"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 left-1/3 w-[620px] h-[360px] rounded-full bg-primary/[0.10] blur-3xl -translate-y-1/2 -translate-x-1/3"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 w-[520px] h-[320px] rounded-full bg-primary/[0.06] blur-3xl translate-y-1/2 translate-x-1/3"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16">
            <SectionHeader
              subtitle="OUR TEAM"
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title="Senior Leadership"
              titleHighlight="Leadership"
              description="Experienced leadership guiding a team of 20+ specialists to deliver reliable, high-quality outcomes for our clients."
              headingId={HEADING_ID}
            />
          </div>

          <div data-reveal className="mb-14 md:mb-16 -mx-4 sm:-mx-6 lg:-mx-8">
            <TiltCard className="relative w-full overflow-hidden rounded-2xl border border-border/70 shadow-xl" maxTilt={8}>
              <div className="relative aspect-[21/9] min-h-[220px] sm:min-h-[280px] md:min-h-[340px] bg-black/40">
                <div className="absolute inset-0 overflow-hidden">
                  <InteractiveImage
                    src={heroImage}
                    alt={heroAlt}
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    className="h-full object-cover"
                    tilt={false}
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                  aria-hidden
                />
                {itTeam && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-lg font-heading font-semibold text-white md:text-xl">
                      {itTeam.name}
                    </p>
                    <p className="mt-1 text-sm text-white/80">{itTeam.designation}</p>
                  </div>
                )}
              </div>
            </TiltCard>
          </div>

          {gridTeam.length > 0 && (
            <div
              className={cn(
                "grid gap-10 md:gap-12",
                "sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {gridTeam.map((member) => (
                <div key={member.id} data-reveal>
                  <Card
                    className={cn(
                      "group h-full rounded-3xl border border-border/70 bg-gradient-to-b from-background/95 via-surface to-surface-muted/90",
                      "shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-primary/20",
                      "transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:bg-surface",
                      "relative overflow-hidden"
                    )}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-80" />
                    <CardHeader className="flex flex-col items-center gap-5 px-7 pt-8 pb-2">
                      <div className="flex flex-col items-center gap-5 w-full">
                        <div className="relative h-40 w-40 md:h-44 md:w-44 shrink-0">
                          {member.imageUrl ? (
                            <Image
                              src={member.imageUrl}
                              alt={member.name}
                              fill
                              className="rounded-3xl object-cover border border-border/60 bg-background/80 ring-2 ring-primary/20 group-hover:ring-primary/60 group-hover:scale-[1.03] transition-all duration-300"
                              sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 200px"
                              quality={95}
                            />
                          ) : (
                            <div className="h-full w-full rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold">
                              {member.name
                                .split(" ")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 text-center">
                          <CardTitle className="text-base md:text-lg font-semibold font-heading">
                            {member.name}
                          </CardTitle>
                          <CardDescription className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/95">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/80 shadow-[0_0_0_3px_rgba(59,130,246,0.35)]" />
                            {member.designation}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-7 pb-7 pt-3">
                      {member.bio && (
                        <p className="text-sm text-foreground-muted leading-relaxed text-center">
                          {member.bio}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
