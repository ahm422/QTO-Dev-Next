"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/shared/Card";
import { ourServicesConfig } from "@/config/ourServices";
import { services } from "@/data/services";
import type { Service } from "@/types/service";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";

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
      className="py-16 md:py-20 bg-[#FDF8ED]"
      aria-labelledby={HEADING_ID}
    >
      <Container>
        <SectionHeader
          subtitle={ourServicesConfig.subtitle}
          subtitleClassName="text-primary"
          title={ourServicesConfig.title}
          titleHighlight={ourServicesConfig.titleHighlight}
          description={ourServicesConfig.description}
          headingId={HEADING_ID}
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr,1.2fr] lg:gap-12">
          {/* Category grid: 2×3 */}
          <div
            role="tablist"
            aria-label="Service categories"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
          >
            {services.map((service, index) => {
              const isSelected = selectedId === service.id;
              return (
                <Card
                  key={service.id}
                  role="tab"
                  id={`our-services-tab-${service.id}`}
                  aria-selected={isSelected}
                  aria-controls={PANEL_ID}
                  tabIndex={isSelected ? 0 : -1}
                  className={cn(
                    "cursor-pointer p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[120px] sm:min-h-[140px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isSelected
                      ? "bg-primary/10 border-primary border-2"
                      : "bg-surface border-border hover:border-primary/50"
                  )}
                  onClick={() => handleSelect(service.id)}
                  onKeyDown={(e) => handleKeyDown(e, service.id, index)}
                >
                  <AppIcon name={service.icon as AppIconName} size="lg" className="mb-2" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">
                    {service.title}
                  </span>
                </Card>
              );
            })}
          </div>

          {/* Detail panel */}
          <div
            id={PANEL_ID}
            role="tabpanel"
            aria-labelledby="our-services-detail-heading"
            aria-describedby="our-services-detail-description"
            className="rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-sm"
          >
            {selected && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <AppIcon name={selected.icon as AppIconName} size="xl" />
                  <h3
                    id="our-services-detail-heading"
                    className="font-heading text-2xl sm:text-3xl font-bold text-foreground"
                  >
                    {selected.title}
                  </h3>
                </div>
                <p
                  id="our-services-detail-description"
                  className="text-foreground-muted text-base mb-6"
                >
                  {selected.description}
                </p>

                {selected.bulletColumns && selected.bulletColumns.length >= 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <ul className="list-disc list-inside space-y-2 text-foreground-muted text-sm">
                      {selected.bulletColumns[0].map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <ul className="list-disc list-inside space-y-2 text-foreground-muted text-sm">
                      {selected.bulletColumns[1].map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.technologyTags && selected.technologyTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selected.technologyTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-border text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={getLearnMoreHref(selected)}
                  className="inline-flex items-center font-semibold text-primary hover:text-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  {ourServicesConfig.learnMoreLabel}
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
