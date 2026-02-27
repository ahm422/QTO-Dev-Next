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
          className="flex items-center gap-3 bg-surface-muted/80 px-4 py-3 sm:px-5 sm:py-4"
        >
          {metric.icon ? (
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <AppIcon name={metric.icon} size="sm" />
            </span>
          ) : null}
          <div>
            <p className="text-base font-semibold text-foreground sm:text-lg">
              {metric.value}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted sm:text-[13px]">
              {metric.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

