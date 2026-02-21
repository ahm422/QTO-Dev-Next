"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/common/SiteLogo";

export function Footer() {
  return (
    <footer className="bg-surface text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <SiteLogo width={140} height={36} className="h-9 w-auto object-contain" />
            </div>
            <p className="text-foreground-muted text-sm">
              Revenue-focused digital product studio for SaaS, e-commerce, and enterprise teams.
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-foreground-muted">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">X</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/web-development" className="text-foreground-muted hover:text-foreground">Web Development</Link></li>
              <li><Link href="/services/mobile-development" className="text-foreground-muted hover:text-foreground">Mobile Development</Link></li>
              <li><Link href="/services/ui-ux-design" className="text-foreground-muted hover:text-foreground">UI/UX Design</Link></li>
              <li><Link href="/services/consulting" className="text-foreground-muted hover:text-foreground">Tech Consulting</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-foreground-muted hover:text-foreground">About</Link></li>
              <li><Link href="/projects" className="text-foreground-muted hover:text-foreground">Projects</Link></li>
              <li><Link href="/blogs" className="text-foreground-muted hover:text-foreground">Blog</Link></li>
              <li><Link href="/careers" className="text-foreground-muted hover:text-foreground">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>hello@qtodev.com</li>
              <li>+1 (555) 010-1000</li>
              <li>USA • UK • Saudi Arabia • Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground-muted text-sm">
              &copy; 2026 QTO Dev. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
              <Link href="/privacy" className="text-foreground-muted hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="text-foreground-muted hover:text-foreground">Terms</Link>
              <Link href="/cookies" className="text-foreground-muted hover:text-foreground">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
