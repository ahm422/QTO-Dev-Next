export interface DepartmentAccent {
  border: string;
  badge: string;
  iconBg: string;
}

const DEPARTMENT_ACCENTS: Record<string, DepartmentAccent> = {
  Engineering: {
    border: "border-t-blue-500",
    badge: "text-blue-600 dark:text-blue-400 bg-blue-500/10 ring-blue-500/20",
    iconBg: "bg-blue-500/12 text-blue-600 dark:text-blue-400 ring-blue-500/15",
  },
  Design: {
    border: "border-t-violet-500",
    badge: "text-violet-600 dark:text-violet-400 bg-violet-500/10 ring-violet-500/20",
    iconBg: "bg-violet-500/12 text-violet-600 dark:text-violet-400 ring-violet-500/15",
  },
  Operations: {
    border: "border-t-amber-500",
    badge: "text-amber-600 dark:text-amber-400 bg-amber-500/10 ring-amber-500/20",
    iconBg: "bg-amber-500/12 text-amber-600 dark:text-amber-400 ring-amber-500/15",
  },
  Delivery: {
    border: "border-t-emerald-500",
    badge: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
    iconBg: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 ring-emerald-500/15",
  },
};

const DEFAULT_ACCENT: DepartmentAccent = {
  border: "border-t-primary",
  badge: "text-primary bg-primary/10 ring-primary/15",
  iconBg: "bg-primary/12 text-primary ring-primary/10",
};

export function getDepartmentAccent(department: string): DepartmentAccent {
  return DEPARTMENT_ACCENTS[department] ?? DEFAULT_ACCENT;
}
