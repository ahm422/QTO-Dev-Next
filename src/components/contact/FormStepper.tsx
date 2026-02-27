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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2 text-xs font-medium text-foreground-muted">
        <span>
          Step {currentStepIndex + 1} of {total}
        </span>
        <span>{steps[currentStepIndex]?.label}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-1.5 rounded-full bg-border/80",
                isCompleted && "bg-primary",
                isActive && !isCompleted && "bg-primary/70"
              )}
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );
}

