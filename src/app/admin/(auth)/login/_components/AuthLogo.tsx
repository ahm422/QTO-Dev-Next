"use client";

import { useAdminTheme } from "@/components/admin/AdminThemeProvider";
import { SiteLogo } from "@/components/common/SiteLogo";

/**
 * Theme-aware wordmark for the admin auth screens. Reads the active admin theme
 * so the correct light/dark logo asset renders on both palettes.
 */
export function AuthLogo({
  width = 132,
  height = 36,
  className = "h-9 w-auto object-contain",
  priority = false,
}: {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const { theme } = useAdminTheme();

  return (
    <SiteLogo
      forcedTheme={theme}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
