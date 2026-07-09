"use client";

import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/types/service";
import { getServiceCardImage } from "@/config/serviceCardImages";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/theme/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type ServiceCardVariant = "compact" | "detailed";

export type ServiceCardProps = {
  readonly service: Service;
  readonly variant: ServiceCardVariant;
  /** CTA label for detailed variant (and compact “Learn more”). */
  readonly learnMoreLabel?: string;
  readonly className?: string;
};

function resolveHref(service: Service): string {
  return service.learnMoreHref ?? `/services/${service.slug}`;
}

export function ServiceCard({
  service,
  variant,
  learnMoreLabel = "Learn more",
  className,
}: ServiceCardProps) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const motionOk = !reducedMotion;
  const tiltOk = motionOk && isDesktop;
  const { src: imageSrc } = getServiceCardImage(service.slug);
  const href = resolveHref(service);
  const features = service.features.slice(0, 4);

  const sizes =
    variant === "compact"
      ? "(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
      : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={cn(
          "group relative flex min-h-[148px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-border/50 p-5 text-center sm:min-h-[168px] sm:p-6",
          "[perspective:800px]",
          "shadow-sm transition-[transform,box-shadow,border-color] duration-300",
          "before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:rounded-full",
          "before:bg-gradient-to-r before:from-transparent before:via-primary before:to-transparent",
          "before:opacity-0 before:transition-opacity before:duration-300",
          "before:shadow-[0_0_20px_rgba(244,139,34,0.5)]",
          motionOk && "hover:-translate-y-1.5 hover:before:opacity-100",
          tiltOk && "hover:rotate-x-[2deg] hover:rotate-y-[-2deg]",
          "hover:border-primary hover:shadow-lg hover:shadow-primary/30",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted",
          className
        )}
      >
        <CardMedia src={imageSrc} sizes={sizes} motionOk={motionOk} />

        <div className="relative z-10 flex flex-col items-center">
          <span
            className={cn(
              "mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
              // Solid badge so icon always has contrast regardless of photo
              "bg-white text-foreground shadow-md",
              "dark:bg-white/15 dark:text-white dark:ring-1 dark:ring-white/25",
              "transition-[transform,background-color,color] duration-300",
              motionOk &&
                "group-hover:-translate-y-0.5 group-hover:rotate-6 group-hover:scale-105",
              "group-hover:bg-primary group-hover:text-white group-hover:ring-0",
              "dark:group-hover:bg-primary dark:group-hover:text-white"
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
              "font-semibold text-sm sm:text-base leading-tight",
              // Light mode: dark title on light wash; dark mode: white on dark wash
              "text-foreground dark:text-white",
              "[text-shadow:0_1px_2px_rgba(255,255,255,0.9)] dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.9)]"
            )}
          >
            {service.title}
          </span>

          <span
            className={cn(
              "mt-2 inline-flex items-center gap-1 text-xs font-semibold",
              // High-contrast CTA chip so orange never fights the photo
              "rounded-full bg-white/95 px-2.5 py-1 text-primary shadow-sm",
              "dark:bg-black/70 dark:text-primary dark:ring-1 dark:ring-primary/40",
              "opacity-0 translate-y-1 transition-all duration-300",
              "group-hover:opacity-100 group-hover:translate-y-0",
              "group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
            )}
          >
            {learnMoreLabel}
            <AppIcon
              name="arrow-right"
              size="sm"
              className={cn(
                "shrink-0 transition-transform duration-300",
                motionOk && "group-hover:translate-x-0.5"
              )}
            />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border/60 border-t-4 border-t-primary",
        "p-8 md:p-9 flex flex-col [perspective:900px]",
        "shadow-lg shadow-black/5 transition-[transform,box-shadow,border-color] duration-300",
        motionOk && "hover:-translate-y-2",
        tiltOk && "hover:rotate-x-[1.5deg] hover:rotate-y-[-1.5deg]",
        "hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-muted",
        className
      )}
    >
      <CardMedia src={imageSrc} sizes={sizes} motionOk={motionOk} />

      <div className="relative z-10 flex flex-1 flex-col">
        <span
          className={cn(
            "inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6",
            "bg-white text-primary shadow-md",
            "dark:bg-white/15 dark:text-primary dark:ring-1 dark:ring-white/20",
            "transition-[transform,background-color,color] duration-300",
            motionOk &&
              "group-hover:-translate-y-1 group-hover:rotate-6 group-hover:scale-105",
            "group-hover:bg-primary group-hover:text-white",
            "dark:group-hover:bg-primary dark:group-hover:text-white"
          )}
        >
          <AppIcon
            name={service.icon as AppIconName}
            size="xl"
            className="shrink-0"
          />
        </span>

        <h2
          className={cn(
            "text-2xl md:text-3xl font-bold mb-3 font-heading tracking-tight",
            "text-foreground dark:text-white",
            "[text-shadow:0_1px_2px_rgba(255,255,255,0.9)] dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.9)]"
          )}
        >
          {service.title}
        </h2>

        <p
          className={cn(
            "mb-6 flex-1 leading-relaxed line-clamp-3",
            "text-foreground/85 dark:text-white/90",
            "[text-shadow:0_1px_1px_rgba(255,255,255,0.75)] dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.8)]"
          )}
        >
          {service.shortDescription}
        </p>

        {features.length > 0 && (
          <div className="mb-8">
            <h3
              className={cn(
                "font-semibold mb-4",
                "text-foreground dark:text-white",
                "[text-shadow:0_1px_2px_rgba(255,255,255,0.9)] dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.9)]"
              )}
            >
              Key Features
            </h3>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li
                  key={feature}
                  className={cn(
                    "flex items-center gap-3",
                    "text-foreground/85 dark:text-white/90"
                  )}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 dark:bg-primary/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          variant="default"
          size="default"
          className="mt-auto w-full inline-flex items-center justify-center gap-2 group/btn shadow-md group-hover:shadow-lg transition-shadow duration-300"
          asChild
        >
          <Link href={href}>
            {learnMoreLabel}
            <AppIcon
              name="arrow-right"
              size="sm"
              className={cn(
                "shrink-0 ml-1 opacity-80 transition-transform duration-300",
                motionOk && "group-hover/btn:translate-x-1 group-hover:translate-x-1"
              )}
            />
          </Link>
        </Button>
      </div>
    </article>
  );
}

type CardMediaProps = {
  readonly src: string;
  readonly sizes: string;
  readonly motionOk: boolean;
};

/**
 * Full-bleed photo + theme wash (no nested content box).
 * Light: soft white scrub for dark type. Dark: dark scrub for light type.
 * Hover eases the wash and sharpens the photo.
 */
function CardMedia({ src, sizes, motionOk }: CardMediaProps) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className={cn(
          "object-cover transition-[transform,filter] duration-500",
          "blur-[3px] saturate-50 grayscale-[20%]",
          "group-hover:blur-0 group-hover:saturate-100 group-hover:grayscale-0",
          motionOk && "group-hover:scale-[1.08]"
        )}
        priority={false}
      />
      {/* Light scrub — strong enough for dark titles without a floating panel */}
      <div
        className={cn(
          "absolute inset-0 dark:hidden transition-opacity duration-500",
          "bg-gradient-to-br from-white/88 via-white/82 to-white/78",
          "group-hover:opacity-55"
        )}
      />
      {/* Dark scrub */}
      <div
        className={cn(
          "absolute inset-0 hidden dark:block transition-opacity duration-500",
          "bg-gradient-to-br from-black/72 via-black/65 to-black/60",
          "group-hover:opacity-45"
        )}
      />
    </div>
  );
}
