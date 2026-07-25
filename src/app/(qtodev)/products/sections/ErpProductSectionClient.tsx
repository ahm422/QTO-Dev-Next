"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon, type AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import type { Product } from "@/types/product";

const HEADING_ID = "products-erp-heading";

const MODULE_ICONS = ["chart-line", "users", "cart-shopping", "link"] as const;

function isHtmlBody(body: string): boolean {
  return /<[a-z][\s\S]*>/i.test(body);
}

function resolveIcon(
  icon: string | undefined,
  fallback: (typeof MODULE_ICONS)[number]
): AppIconName {
  return (icon || fallback) as AppIconName;
}

export function ErpProductSectionClient({
  product,
}: {
  product: Product | null;
}) {
  if (!product) {
    return (
      <section
        className="relative py-20 md:py-28 overflow-hidden bg-surface border-y border-border"
        aria-labelledby={HEADING_ID}
      >
        <Container>
          <p className="text-center text-foreground-muted" id={HEADING_ID}>
            ERP products will appear here once published in the CMS.
          </p>
        </Container>
      </section>
    );
  }

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
              subtitle={product.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={product.title}
              titleHighlight={product.titleHighlight ?? "Solutions"}
              headingId={HEADING_ID}
            />
          </div>

          {product.description && (
            <div data-reveal className="mb-12 max-w-3xl">
              {isHtmlBody(product.description) ? (
                <div
                  className="text-base md:text-lg text-foreground-muted leading-relaxed prose prose-sm md:prose-base max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="text-base md:text-lg text-foreground-muted leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>
          )}

          {product.features.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
              {product.features.map((mod, i) => (
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
                        <AppIcon
                          name={resolveIcon(
                            mod.icon,
                            MODULE_ICONS[i % MODULE_ICONS.length]
                          )}
                          size="sm"
                        />
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
          )}
        </Reveal>
      </Container>
    </section>
  );
}
