"use client";

import { cn } from "@/components/theme/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border shadow-md shadow-black/5",
        "hover:shadow-lg hover:shadow-black/10 transition-all duration-200",
        "ring-1 ring-black/[0.03] ring-inset dark:ring-white/[0.04]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
