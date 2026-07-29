import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { cn } from "@/components/theme/cn";
import { SITE_URL } from "@/lib/constants";
import { SITE_FAVICON } from "@/config/staticImages";
import { generalSans, inter } from "./fonts";

const GTM_ID = "GTM-5DMZ28NG";
const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

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
    icon: SITE_FAVICON,
    apple: SITE_FAVICON,
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
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={cn(
          inter.className,
          "antialiased bg-background text-foreground"
        )}
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
