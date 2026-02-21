import Image from "next/image";
import { WebDevelopmentServiceData } from "@/content/services/web-development";

interface OverviewSectionProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

const iconSet = ["✓", "🛡️", "🚀", "⚙️", "📈", "🔍"];

export function OverviewSection({ service, blurDataURL }: OverviewSectionProps) {
  return (
    <section className="py-14 md:py-20" aria-labelledby="overview-heading">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8">
        <div>
          <h2 id="overview-heading" className="text-2xl font-bold text-foreground md:text-3xl">
            Why Companies Choose Us for Web Development
          </h2>
          <p className="mt-5 text-base leading-8 text-foreground-muted">{service.overviewText}</p>

          <ul className="mt-6 space-y-3">
            {service.overviewBenefits.map((benefit, idx) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-foreground-muted">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true">
                  {iconSet[idx % iconSet.length]}
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-lg">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={service.overviewImage.url}
              alt={service.overviewImage.alt}
              fill
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
