"use client";

import { cn } from "@/components/theme/cn";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export function Heading({ level = 2, className, children, ...props }: HeadingProps) {
  const sizeMap = {
    1: "text-5xl font-bold",
    2: "text-4xl font-bold",
    3: "text-3xl font-bold",
    4: "text-2xl font-bold",
    5: "text-xl font-semibold",
    6: "text-lg font-semibold",
  };

  const Tag = `h${level}` as const;

  return (
    <Tag
      className={cn(sizeMap[level], "leading-tight", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
