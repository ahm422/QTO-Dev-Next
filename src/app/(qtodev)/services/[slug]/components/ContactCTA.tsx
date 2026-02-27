import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-background" aria-labelledby="contact-cta-heading">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div
            className="grid grid-cols-1 gap-8 rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/5 ring-1 ring-black/[0.03] md:p-10 lg:grid-cols-2 lg:gap-12"
            data-reveal
          >
            <div className="flex flex-col justify-center">
              <SectionHeader
                subtitle="Contact"
                subtitleClassName="text-primary font-semibold tracking-[0.2em]"
                subtitlePill
                title="Ready to build your next big thing?"
                description="Tell us what you are building and where you need help. Our team replies quickly with a practical plan."
                headingId="contact-cta-heading"
                centered={false}
              />
              <ul className="mt-6 space-y-3 text-sm text-foreground-muted">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs" aria-hidden>✓</span>
                  Fast reply and clear next steps
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs" aria-hidden>✓</span>
                  No long contracts required
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs" aria-hidden>✓</span>
                  Transparent pricing and delivery model
                </li>
              </ul>
            </div>

            <form
              className="rounded-2xl border border-border bg-surface-muted/80 p-6 shadow-inner ring-1 ring-black/[0.03] md:p-7"
              action="/api/contact"
              method="post"
            >
              <div className="grid grid-cols-1 gap-4">
                <label className="text-sm font-medium text-foreground">
                  Name
                  <input
                    name="name"
                    required
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="text-sm font-medium text-foreground">
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="text-sm font-medium text-foreground">
                  Company
                  <input
                    name="company"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="text-sm font-medium text-foreground">
                  Project type
                  <select
                    name="projectType"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="mvp">MVP Development</option>
                    <option value="saas">SaaS Platform</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="enterprise">Enterprise Portal</option>
                    <option value="redesign">UI/UX Redesign</option>
                    <option value="maintenance">Maintenance &amp; Scaling</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-foreground">
                  Message
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
                >
                  Send message – we reply in &lt;24h
                </button>

                <p className="text-center text-xs text-foreground-muted">
                  Or{" "}
                  <Link
                    href="/contact?intent=book-call"
                    className="font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted rounded"
                  >
                    book 15-min call instead →
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
