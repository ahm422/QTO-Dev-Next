import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";

interface MetricItem {
  icon?: React.ComponentProps<typeof AppIcon>["name"];
  label: string;
  value: string;
}

interface TrustStripProps {
  metrics?: MetricItem[];
  className?: string;
  orientation?: "row" | "column";
}

const defaultMetrics: MetricItem[] = [
  {
    icon: "star",
    value: "100+",
    label: "projects delivered",
  },
  {
    icon: "users",
    value: "7+ years",
    label: "product experience",
  },
  {
    icon: "circle-check",
    value: "98%",
    label: "client satisfaction",
  },
];

export function TrustStrip({
  metrics = defaultMetrics,
  className,
  orientation = "row",
}: TrustStripProps) {
  const isStackedCards = orientation === "column";

  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4",
        orientation === "row"
          ? "grid-cols-1 sm:grid-cols-3"
          : "grid-cols-1",
        className
      )}
    >
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className={cn(
            "bg-surface-muted/80 shadow-sm",
            isStackedCards
              ? "flex flex-col items-center text-center gap-0 px-4 py-5 sm:px-5 sm:py-6 rounded-2xl border border-border/70"
              : "flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4"
          )}
        >
          {metric.icon ? (
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary",
                isStackedCards ? "h-11 w-11 sm:h-12 sm:w-12 mb-3" : "h-9 w-9 shrink-0"
              )}
            >
              <AppIcon name={metric.icon} size={isStackedCards ? "base" : "sm"} />
            </span>
          ) : null}
          <div className={isStackedCards ? "space-y-1" : ""}>
            <p
              className={cn(
                "font-semibold text-foreground",
                isStackedCards ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
              )}
            >
              {metric.value}
            </p>
            <p
              className={cn(
                "font-medium uppercase tracking-wide text-foreground-muted",
                isStackedCards ? "text-[11px] sm:text-xs tracking-[0.12em]" : "text-xs sm:text-[13px]"
              )}
            >
              {metric.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

