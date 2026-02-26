"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ourServicesConfig } from "@/config/ourServices";
import { services } from "@/data/services";
import type { Service } from "@/types/service";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";

const PANEL_ID = "our-services-detail-panel";
const HEADING_ID = "our-services-heading";

function getLearnMoreHref(service: Service): string {
  return service.learnMoreHref ?? `/services/${service.slug}`;
}

export function OurServicesSection() {
  const [selectedId, setSelectedId] = useState<string>(services[0]?.id ?? "");
  const selected = services.find((s) => s.id === selectedId) ?? services[0];

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectedId(id);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = services[index + 1];
        if (next) setSelectedId(next.id);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = services[index - 1];
        if (prev) setSelectedId(prev.id);
      }
    },
    []
  );

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs for depth */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[480px] h-[320px] rounded-full bg-primary/[0.04] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[280px] rounded-full bg-primary/[0.03] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16">
            <SectionHeader
              subtitle={ourServicesConfig.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={ourServicesConfig.title}
              titleHighlight={ourServicesConfig.titleHighlight}
              description={ourServicesConfig.description}
              headingId={HEADING_ID}
            />
          </div>

          <div
            data-reveal
            className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,1.25fr] lg:gap-14"
          >
            {/* Service category grid: 2×3 */}
            <div
              role="tablist"
              aria-label="Service categories"
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {services.map((service, index) => {
                const isSelected = selectedId === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    id={`our-services-tab-${service.id}`}
                    aria-selected={isSelected}
                    aria-controls={PANEL_ID}
                    tabIndex={isSelected ? 0 : -1}
                    className={cn(
                      "rounded-xl border-2 p-5 sm:p-6 flex flex-col items-center justify-center text-center",
                      "min-h-[130px] sm:min-h-[150px] transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted",
                      isSelected
                        ? "bg-surface border-primary shadow-lg shadow-primary/10"
                        : "bg-surface border-border hover:border-primary/40 hover:shadow-md"
                    )}
                    onClick={() => handleSelect(service.id)}
                    onKeyDown={(e) => handleKeyDown(e, service.id, index)}
                  >
                    <span
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                        isSelected ? "bg-primary/15 text-primary" : "bg-surface-muted text-foreground-muted"
                      )}
                    >
                      <AppIcon
                        name={service.icon as AppIconName}
                        size="lg"
                        className="shrink-0"
                      />
                    </span>
                    <span
                      className={cn(
                        "font-semibold text-foreground text-sm sm:text-base leading-tight",
                        isSelected && "text-primary"
                      )}
                    >
                      {service.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div
              id={PANEL_ID}
              role="tabpanel"
              aria-labelledby="our-services-detail-heading"
              aria-describedby="our-services-detail-description"
              className={cn(
                "rounded-2xl border border-border bg-surface p-6 sm:p-8 md:p-9",
                "shadow-lg shadow-black/5",
                "border-l-4 border-l-primary"
              )}
            >
              {selected && (
                <>
                  <div className="flex items-start gap-4 mb-5">
                    <span className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <AppIcon name={selected.icon as AppIconName} size="xl" />
                    </span>
                    <div>
                      <h3
                        id="our-services-detail-heading"
                        className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-tight"
                      >
                        {selected.title}
                      </h3>
                      <p
                        id="our-services-detail-description"
                        className="text-foreground-muted text-base sm:text-lg leading-relaxed mt-2"
                      >
                        {selected.description}
                      </p>
                    </div>
                  </div>

                  {selected.bulletColumns && selected.bulletColumns.length >= 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-6">
                      <ul className="space-y-3 text-foreground-muted text-sm sm:text-base">
                        {selected.bulletColumns[0].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-3 text-foreground-muted text-sm sm:text-base">
                        {selected.bulletColumns[1].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selected.technologyTags && selected.technologyTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selected.technologyTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-foreground border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={getLearnMoreHref(selected)}
                    className={cn(
                      "inline-flex items-center gap-2 font-semibold text-primary",
                      "hover:text-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-lg px-1 -ml-1",
                      "transition-colors"
                    )}
                  >
                    {ourServicesConfig.learnMoreLabel}
                  </Link>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
