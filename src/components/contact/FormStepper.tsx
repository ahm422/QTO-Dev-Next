import { cn } from "@/components/theme/cn";

interface Step {
  id: string;
  label: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStepIndex: number;
}

export function FormStepper({ steps, currentStepIndex }: FormStepperProps) {
  const total = steps.length;
  const progress = total > 1 ? (currentStepIndex / (total - 1)) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2 text-xs font-medium text-foreground-muted">
        <span>
          Step {currentStepIndex + 1} of {total}
        </span>
        <span>{steps[currentStepIndex]?.label}</span>
      </div>
      <div className="mt-3">
        <div className="relative h-2 rounded-full bg-border/70 overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between" aria-hidden="true">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-2",
                  index !== 0 && "pl-2"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isActive && !isCompleted && "border-primary/60 bg-primary/10 text-primary",
                    !isActive && !isCompleted && "border-border bg-background text-foreground-muted"
                  )}
                >
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

