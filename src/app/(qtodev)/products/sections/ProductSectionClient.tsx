"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon, type AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { isHtmlBody, sanitizeHtml } from "@/lib/sanitize-html";
import type { Product } from "@/types/product";

const MODULE_ICONS = ["chart-line", "users", "cart-shopping", "link"] as const;
const DEFAULT_PRODUCT_IMAGE =
  "https://pub-your-r2-bucket-id.r2.dev/media/4a92c122-6f8d-4001-a92f-ae318cd45775/20260727_164532.png";

function resolveIcon(
  icon: string | undefined,
  fallback: (typeof MODULE_ICONS)[number]
): AppIconName {
  return (icon || fallback) as AppIconName;
}

export function ProductSectionClient({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const headingId = `products-${product.slug}-heading`;
  const isEven = index % 2 === 0;
  const productNumber = String(index + 1).padStart(2, "0");
  const [imageSrc, setImageSrc] = useState(product.image || DEFAULT_PRODUCT_IMAGE);
  const imageAlt = product.imageAlt || `${product.title} preview`;

  return (
    <section
      id={product.slug}
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        isEven
          ? "bg-surface border-y border-border"
          : "bg-surface-muted"
      )}
      aria-labelledby={headingId}
    >
      <div
        className={cn(
          "pointer-events-none absolute top-0 w-[520px] h-[320px] rounded-full bg-primary/[0.06] blur-3xl -translate-y-1/2",
          isEven ? "right-1/4" : "left-1/4"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 w-[420px] h-[280px] rounded-full bg-primary/[0.04] blur-3xl translate-y-1/2",
          isEven ? "left-1/3" : "right-1/3"
        )}
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="mb-8 flex flex-wrap items-center gap-3" data-reveal>
            <span className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-foreground-muted">
              Product {productNumber}
            </span>
            {product.statusLabel && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border border-primary/30 bg-primary/10",
                  "px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary"
                )}
              >
                {product.statusLabel}
              </span>
            )}
            <span className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-foreground-muted">
              #{product.slug}
            </span>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] xl:items-center">
            <div data-reveal>
              <div
                className={
                  product.shortDescription ? "mb-4 md:mb-6" : "mb-8 md:mb-10"
                }
              >
                <SectionHeader
                  subtitle={product.subtitle}
                  subtitleClassName="text-primary font-semibold tracking-widest"
                  subtitlePill
                  title={product.title}
                  titleHighlight={product.titleHighlight}
                  headingId={headingId}
                />
              </div>

              {product.shortDescription && (
                <p className="mb-5 max-w-3xl text-lg font-medium leading-relaxed text-foreground md:text-xl">
                  {product.shortDescription}
                </p>
              )}

              {product.description && (
                <div className="max-w-3xl">
                  {isHtmlBody(product.description) ? (
                    <div
                      className="prose-style text-base md:text-lg leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                    />
                  ) : (
                    <p className="text-base md:text-lg text-foreground-muted leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>
              )}

              {product.features.length > 0 && (
                <div className="mt-8 inline-flex items-center rounded-2xl border border-border/70 bg-background/70 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                      Included Features
                    </p>
                    <p className="mt-2 text-lg font-heading font-semibold text-foreground">
                      {product.features.length}{" "}
                      {product.features.length === 1 ? "capability" : "capabilities"}{" "}
                      tailored for this product
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div data-reveal>
              <div className="overflow-hidden rounded-[32px] border border-border/70 bg-gradient-to-br from-background via-surface to-surface-muted shadow-xl shadow-black/5">
                <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-4 md:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                      Featured Preview
                    </p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      A visual snapshot of the product experience.
                    </p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                    {productNumber}
                  </span>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 720px"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
                    onError={() => {
                      if (imageSrc !== DEFAULT_PRODUCT_IMAGE) {
                        setImageSrc(DEFAULT_PRODUCT_IMAGE);
                      }
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>

          {product.features.length > 0 && (
            <div className="mt-14 border-t border-border/70 pt-10 md:mt-16 md:pt-12">
              <div data-reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">
                    Included Features
                  </p>
                  <h3 className="mt-2 text-2xl font-heading font-semibold text-foreground">
                    Built to support the full workflow
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-foreground-muted">
                  Each module is presented as a focused capability so visitors can scan what matters most, faster.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {product.features.map((mod, i) => (
                <div key={mod.name} data-reveal>
                  <Card
                    className={cn(
                      "group relative h-full overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-background/95 via-surface to-surface-muted/90",
                      "shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-primary/15",
                      "transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60"
                    )}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="p-6 md:p-7">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <span
                          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
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
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
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
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
