"use client";

import Image from "next/image";
import { cn } from "@/components/theme/cn";
import { TiltCard } from "@/components/animations/TiltCard";

export function InteractiveImage({
  src,
  alt,
  priority,
  sizes = "100vw",
  className,
  tilt = true,
  parallax = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  tilt?: boolean;
  parallax?: boolean;
}) {
  const image = (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        parallax &&
          "[transform:translate3d(calc(var(--hero-parallax-x,0)*8px),calc(var(--hero-parallax-y,0)*8px),0)]"
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    </div>
  );

  if (!tilt) {
    return <div className="relative aspect-[4/3] w-full">{image}</div>;
  }

  return (
    <TiltCard className="relative aspect-[4/3] w-full" enableParallax={parallax}>
      {image}
    </TiltCard>
  );
}
