"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/common/SiteLogo";
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

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-auto min-w-[2rem]">
              <SiteLogo priority />
            </div>
            <span className="hidden sm:inline font-semibold text-foreground">
              QTO Dev
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="rounded-lg border border-border p-2 text-foreground hover:bg-surface-muted transition-colors"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              href="/contact?intent=book-call"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Book a Call
            </Link>
            <Link
              href="/contact?intent=get-quote"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-3 py-1.5 text-sm font-semibold text-primary hover:bg-surface-muted"
            >
              Get Quote
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="inline-flex md:hidden items-center justify-center rounded-md border border-border p-2 text-foreground hover:bg-surface-muted"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-border py-3 md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                  className="rounded-lg border border-border p-2 text-foreground hover:bg-surface-muted"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/contact?intent=book-call"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                >
                  Book a Call
                </Link>
                <Link
                  href="/contact?intent=get-quote"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-lg border-2 border-primary px-3 py-1.5 text-sm font-semibold text-primary hover:bg-surface-muted"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
