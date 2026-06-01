import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { cn } from "@/components/theme/cn";
import { SITE_URL } from "@/lib/constants";
import { generalSans, inter } from "./fonts";

const themeScript = `
(function() {
  var key = 'theme';
  var stored = localStorage.getItem(key);
  var theme = (stored === 'light' || stored === 'dark') ? stored : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "QTO Dev - Web Development & Design Services",
  description:
    "Premium web development, mobile app development, and UI/UX design services for modern businesses.",
  icons: {
    icon: "/images/fav-icon/icon.png",
    apple: "/images/fav-icon/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(generalSans.variable, inter.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={cn(
          inter.className,
          "antialiased bg-background text-foreground"
        )}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
