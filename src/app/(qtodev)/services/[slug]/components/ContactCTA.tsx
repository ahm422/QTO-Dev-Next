import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="py-14 md:py-20" aria-labelledby="contact-cta-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8 lg:grid-cols-2">
          <div>
            <h2 id="contact-cta-heading" className="text-2xl font-bold text-foreground md:text-3xl">
              Ready to Build Your Next Big Thing?
            </h2>
            <p className="mt-4 text-foreground-muted">
              Tell us what you are building and where you need help. Our team replies quickly with a practical plan.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground-muted">
              <li>✓ Fast reply and clear next steps</li>
              <li>✓ No long contracts required</li>
              <li>✓ Transparent pricing and delivery model</li>
            </ul>
          </div>

          <form className="rounded-xl border border-border bg-surface-muted p-5" action="/api/contact" method="post">
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm font-medium text-foreground">
                Name
                <input name="name" required className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </label>

              <label className="text-sm font-medium text-foreground">
                Email
                <input type="email" name="email" required className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </label>

              <label className="text-sm font-medium text-foreground">
                Company
                <input name="company" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </label>

              <label className="text-sm font-medium text-foreground">
                Project type
                <select name="projectType" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="mvp">MVP Development</option>
                  <option value="saas">SaaS Platform</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="enterprise">Enterprise Portal</option>
                  <option value="redesign">UI/UX Redesign</option>
                  <option value="maintenance">Maintenance & Scaling</option>
                </select>
              </label>

              <label className="text-sm font-medium text-foreground">
                Message
                <textarea name="message" rows={4} required className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </label>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Send Message – We Reply in &lt;24h
              </button>

              <p className="text-xs text-foreground-muted">
                Or <Link href="/contact?intent=book-call" className="font-semibold text-primary hover:text-primary-hover">book 15-min call instead →</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
