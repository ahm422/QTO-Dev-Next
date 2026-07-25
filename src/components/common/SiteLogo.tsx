"use client";

import Image from "next/image";
import { useTheme } from "@/components/theme/ThemeProvider";
import { SITE_LOGO_DARK, SITE_LOGO_LIGHT } from "@/config/staticImages";

const LOGO_LIGHT = SITE_LOGO_LIGHT;
const LOGO_DARK = SITE_LOGO_DARK;

interface SiteLogoProps {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  forcedTheme?: "light" | "dark";
}

export function SiteLogo({
  alt = "QTO Dev",
  width = 120,
  height = 32,
  className = "h-8 w-auto object-contain",
  priority = false,
  forcedTheme,
}: SiteLogoProps) {
  const { theme } = useTheme();
  const src = (forcedTheme ?? theme) === "dark" ? LOGO_DARK : LOGO_LIGHT;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
