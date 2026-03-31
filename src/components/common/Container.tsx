import type React from "react";
import { cn } from "@/components/theme/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** sm: 768px, md: 1024px, lg: 1280px, xl: 1536px, full: 100% */
  size?: "sm" | "md" | "lg" | "xl" | "full";
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
    xl: "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
