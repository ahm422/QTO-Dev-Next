"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import type { ErpSolutionsContent } from "@/lib/cms/mappers";

const HEADING_ID = "about-erp-heading";

const MODULE_ICONS = ["chart-line", "users", "cart-shopping", "link"] as const;

function isHtmlBody(body: string): boolean {
  return /<[a-z][\s\S]*>/i.test(body);
}

export function ErpSolutionsSectionClient({
  content,
}: {
  content: ErpSolutionsContent;
}) {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden bg-surface border-y border-border"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 right-1/4 w-[520px] h-[320px] rounded-full bg-primary/[0.06] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 w-[420px] h-[280px] rounded-full bg-primary/[0.04] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16">
            <SectionHeader
              subtitle={content.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={content.title}
              titleHighlight="Solutions"
              headingId={HEADING_ID}
            />
          </div>

          {content.body && (
            <div data-reveal className="mb-12 max-w-3xl">
              {isHtmlBody(content.body) ? (
                <div
                  className="text-base md:text-lg text-foreground-muted leading-relaxed prose prose-sm md:prose-base max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: content.body }}
                />
              ) : (
                <p className="text-base md:text-lg text-foreground-muted leading-relaxed">
                  {content.body}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {content.modules.map((mod, i) => (
              <div key={mod.name} data-reveal>
                <Card
                  className={cn(
                    "group h-full rounded-3xl border border-border/70 bg-gradient-to-b from-background/95 via-surface to-surface-muted/90",
                    "shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-primary/15",
                    "transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60"
                  )}
                >
                  <div className="p-6 md:p-7">
                    <span
                      className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      aria-hidden
                    >
                      <AppIcon name={MODULE_ICONS[i % MODULE_ICONS.length]} size="sm" />
                    </span>
                    <h3 className="text-base font-semibold font-heading text-foreground mb-2">
                      {mod.name}
                    </h3>
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {content.industries.length > 0 && (
            <div data-reveal className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
                Industries served
              </p>
              <div className="flex flex-wrap gap-2.5">
                {content.industries.map((industry) => (
                  <span
                    key={industry}
                    className="inline-flex items-center rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-foreground"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div data-reveal>
            <Card className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-orange-400/5 p-8 md:p-10 shadow-lg">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0" />
              <h3 className="text-lg md:text-xl font-semibold font-heading text-foreground mb-3">
                {content.legacyModernization.title}
              </h3>
              <p className="text-base text-foreground-muted leading-relaxed max-w-3xl">
                {content.legacyModernization.body}
              </p>
            </Card>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
