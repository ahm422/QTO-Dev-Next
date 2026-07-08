"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderCTAButton } from "@/components/common/HeaderCTAButton";
import { SiteLogo } from "@/components/common/SiteLogo";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blogs" },
  { label: "Careers", href: "/careers" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 relative border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-16 py-3 sm:min-h-[72px] sm:py-4 md:min-h-20 md:py-5 lg:min-h-24 lg:py-6 gap-3 sm:gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <div className="relative h-8 w-auto min-w-[2rem] sm:h-9 lg:h-10 sm:min-w-[2.25rem] lg:min-w-[2.5rem]">
              <SiteLogo priority className="h-full w-auto object-contain" />
            </div>
          </Link>

          <div className="hidden xl:flex flex-1 justify-center items-center min-w-0">
            <div
              className="rounded-full bg-surface-muted p-1 shadow-sm flex items-center gap-0.5 lg:p-1.5"
              role="navigation"
              aria-label="Main navigation"
            >
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm font-medium transition-colors rounded-full px-3 py-1.5 lg:px-4 lg:py-2 ${
                      active
                        ? "bg-foreground text-background"
                        : "text-foreground-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden xl:flex shrink-0 items-center gap-2 lg:gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="lg:size-10"
              onClick={toggleTheme}
            >
              <AppIcon name={theme === "dark" ? "sun" : "moon"} size="sm" className="h-5 w-5 lg:h-6 lg:w-6" />
            </Button>
            <HeaderCTAButton
              href="/contact"
              isActive={isActive(pathname, "/contact")}
              className="lg:px-5 lg:py-2.5 lg:text-base"
            >
              Contact Us
            </HeaderCTAButton>
            <HeaderCTAButton
              href="/requirements"
              isActive={isActive(pathname, "/requirements")}
              className="lg:px-5 lg:py-2.5 lg:text-base"
            >
              Requirements
            </HeaderCTAButton>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation-panel"
            className="inline-flex xl:hidden sm:size-9"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <AppIcon name={isMenuOpen ? "xmark" : "bars"} size="sm" className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="xl:hidden fixed inset-0 z-30 cursor-default bg-background/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            id="main-navigation-panel"
            className="xl:hidden absolute left-0 right-0 top-full z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 max-h-[calc(100vh-5rem)] overflow-auto">
              <nav className="flex flex-col gap-1 rounded-xl bg-surface-muted p-2 shadow-sm" role="navigation" aria-label="Main navigation">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors text-center ${
                        active
                          ? "bg-foreground text-background"
                          : "text-foreground-muted hover:bg-foreground/10 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                  onClick={toggleTheme}
                >
                  <AppIcon name={theme === "dark" ? "sun" : "moon"} size="sm" className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <HeaderCTAButton
                  href="/contact"
                  isActive={isActive(pathname, "/contact")}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full justify-center"
                >
                  Contact Us
                </HeaderCTAButton>
                <HeaderCTAButton
                  href="/requirements"
                  isActive={isActive(pathname, "/requirements")}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full justify-center"
                >
                  Requirements
                </HeaderCTAButton>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
}
