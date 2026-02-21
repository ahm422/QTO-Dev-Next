/**
 * Centralized theme tokens for QTO Dev.
 * Colors derived from brand logos:
 * - Light theme: light backgrounds, dark text, orange primary (from logo accent).
 * - Dark theme: from footer-logo.png — black #000000, white #FFFFFF (QTO text), orange #F9A825 (DEV text).
 */

export const colors = {
  /** Brand orange from logo (DEV) — #F9A825 */
  primary: "#F9A825",
  accent: "#F9A825",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  dark: "#000000",
  light: "#F9FAFB",
  white: "#FFFFFF",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
};

/** Light theme: light backgrounds, dark text, brand orange primary (logo accent). */
export const lightTheme = {
  background: "#FFFFFF",
  surface: "#F9FAFB",
  foreground: "#111827",
  foregroundMuted: "#6B7280",
  border: "#E5E7EB",
  primary: "#F9A825",
  primaryHover: "#F7941D",
  primaryForeground: "#000000",
  accent: "#F9A825",
  surfaceMuted: "#FFF8E7",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
} as const;

/** Dark theme: from footer-logo.png — black bg #000000, white text #FFFFFF, orange #F9A825. */
export const darkTheme = {
  background: "#000000",
  surface: "#0a0a0a",
  foreground: "#FFFFFF",
  foregroundMuted: "#a3a3a3",
  border: "#262626",
  primary: "#F9A825",
  primaryHover: "#F7941D",
  primaryForeground: "#000000",
  accent: "#F9A825",
  surfaceMuted: "#1a1a1a",
  success: "#34D399",
  error: "#F87171",
  warning: "#FBBF24",
} as const;

export type ThemeKeys = keyof typeof lightTheme;

export const spacing = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
  "2xl": "4rem",
  "3xl": "6rem",
};

export const borderRadius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
};

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
};

export const transitions = {
  fast: "150ms ease-in-out",
  base: "250ms ease-in-out",
  slow: "350ms ease-in-out",
};
