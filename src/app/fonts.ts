import localFont from "next/font/local";
import { Inter } from "next/font/google";

/**
 * General Sans — heading font (Fontshare). Variable font: one file, weights 200–700.
 * Exposes CSS variable --font-general-sans for use in @theme and h1–h6.
 */
export const generalSans = localFont({
  src: [
    {
      path: "../../public/fonts/Fonts/WEB/fonts/GeneralSans-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/**
 * Inter — body font. Loaded from next/font/google and applied to body.
 * Exposes CSS variable --font-inter for use in @theme.
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
