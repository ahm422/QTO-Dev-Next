"use client";

import { cn } from "@/components/theme/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Container({
  children,
  size = "lg",
  className,
  ...props
}: ContainerProps) {
  const sizeMap = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
  };

  return (
    <div
      className={cn("mx-auto px-4 sm:px-6 lg:px-8", sizeMap[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
