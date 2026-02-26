"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/common/SiteLogo";
import { footerSections, socialLinks, siteConfig } from "@/data/site";
import { cn } from "@/components/theme/cn";

const CONTACT = {
  email: "hello@qtodev.com",
  phone: "+1 (555) 010-1000",
  locations: "USA • UK • Saudi Arabia • Pakistan",
} as const;

export function Footer() {
  return (
    <footer
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-b from-surface via-surface-muted/30 to-surface",
        "border-t border-border/80"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-5">
              <SiteLogo width={140} height={36} className="h-9 w-auto object-contain" />
            </div>
            <p className="text-foreground-muted text-sm leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>
            {/* Social links */}
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/80",
                    "text-foreground-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    "transition-colors"
                  )}
                  aria-label={label}
                >
                  <SocialIcon name={label} />
                </a>
              ))}
            </div>
            {/* Contact snippet */}
            <div className="mt-8 space-y-2 text-sm text-foreground-muted">
              <p>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-primary transition-colors">
                  {CONTACT.email}
                </a>
              </p>
              <p>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                  {CONTACT.phone}
                </a>
              </p>
              <p>{CONTACT.locations}</p>
            </div>
          </div>

          {/* Link columns from footerSections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-foreground-muted hover:text-primary transition-colors",
                        link.href.startsWith("#") && "scroll-smooth"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-foreground-muted text-sm order-2 sm:order-1">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <nav className="flex flex-wrap gap-6 text-sm order-1 sm:order-2" aria-label="Legal">
              <Link href="/privacy" className="text-foreground-muted hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-foreground-muted hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-foreground-muted hover:text-primary transition-colors">
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const className = "h-4 w-4 currentColor";
  switch (name.toLowerCase()) {
    case "linkedin":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "github":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      );
    default:
      return <span className="text-xs font-semibold" aria-hidden>{name.charAt(0).toUpperCase()}</span>;
  }
}
