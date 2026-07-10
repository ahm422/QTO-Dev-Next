import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface Step {
  id: string;
  label: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStepIndex: number;
  className?: string;
}

export function FormStepper({ steps, currentStepIndex, className }: FormStepperProps) {
  const total = steps.length;
  const progress = total > 1 ? (currentStepIndex / (total - 1)) * 100 : 100;

  return (
    <nav className={cn("mb-8", className)} aria-label="Form progress">
      <div className="flex items-center justify-between gap-2 text-xs font-medium text-foreground-muted">
        <span>
          Step {currentStepIndex + 1} of {total}
        </span>
        <span className="hidden sm:inline truncate max-w-[50%] text-right">
          {steps[currentStepIndex]?.label}
        </span>
      </div>
      <div className="mt-3">
        <div
          className="relative h-2 rounded-full bg-border/70 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="mt-4 hidden sm:flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isLast = index === steps.length - 1;

            return (
              <li
                key={step.id}
                className={cn("flex flex-1 items-center", !isLast && "min-w-0")}
                aria-current={isActive ? "step" : undefined}
              >
                <div className="flex min-w-0 flex-col items-center gap-1.5 flex-1">
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold shrink-0",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      isActive && !isCompleted && "border-primary/60 bg-primary/10 text-primary",
                      !isActive && !isCompleted && "border-border bg-background text-foreground-muted"
                    )}
                  >
                    {isCompleted ? (
                      <AppIcon name="check" size="sm" className="!text-[10px]" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium text-center truncate w-full max-w-[7rem]",
                      isActive ? "text-foreground" : "text-foreground-muted"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast ? (
                  <div
                    className={cn(
                      "mx-1 h-px flex-1 min-w-[1rem]",
                      index < currentStepIndex ? "bg-primary/50" : "bg-border/80"
                    )}
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

interface MobileFormStepBarProps {
  steps: Step[];
  currentStepIndex: number;
}

export function MobileFormStepBar({ steps, currentStepIndex }: MobileFormStepBarProps) {
  const total = steps.length;
  const progress = total > 1 ? ((currentStepIndex + 1) / total) * 100 : 100;
  const currentLabel = steps[currentStepIndex]?.label ?? "";

  return (
    <div
      className="sticky top-16 z-20 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
      aria-label="Current form step"
    >
      <p className="text-xs font-medium text-foreground-muted">
        Step {currentStepIndex + 1} of {total}
        <span className="text-foreground"> — {currentLabel}</span>
      </p>
      <div className="mt-2 h-1 rounded-full bg-border/70 overflow-hidden" aria-hidden>
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
