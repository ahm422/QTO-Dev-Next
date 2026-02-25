import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/shared/Card";
import { portfolioConfig } from "@/config/portfolio";
import { portfolioCases } from "@/data/portfolio";
import type { PortfolioGradientKey } from "@/types/portfolio";
import { cn } from "@/components/theme/cn";

const SECTION_HEADING_ID = "portfolio-heading";

const gradientClasses: Record<PortfolioGradientKey, string> = {
  "blue-purple": "from-blue-500 to-purple-600",
  grey: "from-slate-400 to-slate-600",
  dark: "from-slate-600 to-slate-800",
  orange: "from-orange-400 to-amber-600",
  green: "from-emerald-500 to-teal-600",
  red: "from-rose-500 to-red-600",
};

export function PortfolioSection() {
  return (
    <section
      className="py-16 md:py-20 bg-[#FDF8ED]"
      aria-labelledby={SECTION_HEADING_ID}
    >
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex-1">
            <SectionHeader
              subtitle={portfolioConfig.subtitle}
              title={portfolioConfig.title}
              titleHighlight={portfolioConfig.titleHighlight}
              description={portfolioConfig.description}
              headingId={SECTION_HEADING_ID}
              centered={false}
            />
          </div>
          <Link
            href={portfolioConfig.viewAllHref}
            className="shrink-0 inline-flex items-center justify-center rounded-lg bg-cta-gold px-4 py-2.5 text-sm font-semibold text-cta-gold-foreground transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta-gold focus-visible:ring-offset-2"
            aria-label="View all portfolio projects"
          >
            {portfolioConfig.viewAllLabel}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:mt-12 lg:grid-cols-3">
          {portfolioCases.map((item) => {
            const cardContent = (
              <>
                <div className="mb-4 flex justify-end">
                  <span
                    className="inline-flex rounded-lg bg-cta-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cta-gold"
                    aria-hidden
                  >
                    CASE #{item.caseNumber}
                  </span>
                </div>
                <div className="flex flex-col items-center py-4">
                  <div
                    className={cn(
                      "flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-bold text-white",
                      gradientClasses[item.gradient]
                    )}
                  >
                    <span aria-hidden>{item.initial}</span>
                  </div>
                  <h3 className="mt-4 text-center font-heading text-lg font-semibold text-foreground">
                    {item.companyName}
                  </h3>
                  <p className="mt-1 text-center text-xs font-medium uppercase tracking-wide text-foreground-muted">
                    {item.industry}
                  </p>
                </div>
              </>
            );

            const href = item.slug ? `/projects/${item.slug}` : undefined;

            if (href) {
              return (
                <Link
                  key={item.caseNumber}
                  href={href}
                  className="block"
                  aria-label={`View project: ${item.companyName}`}
                >
                  <Card className="h-full p-6 transition-shadow hover:shadow-md">
                    {cardContent}
                  </Card>
                </Link>
              );
            }

            return (
              <Card key={item.caseNumber} className="p-6">
                {cardContent}
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
