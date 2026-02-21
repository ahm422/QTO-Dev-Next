"use client";

import { cn } from "@/components/theme/cn";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "base" | "lg";
  color?: "default" | "muted" | "light";
  children: React.ReactNode;
}

export function Text({
  size = "base",
  color = "default",
  className,
  children,
  ...props
}: TextProps) {
  const sizeStyles = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  };

  const colorStyles = {
    default: "text-foreground",
    muted: "text-foreground-muted",
    light: "text-foreground-muted",
  };

  return (
    <p className={cn(sizeStyles[size], colorStyles[color], className)} {...props}>
      {children}
    </p>
  );
}
