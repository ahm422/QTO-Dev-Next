import Link from "next/link";

export function ContactCTAWithLocations() {
  return (
    <section className="border-y border-border bg-surface py-12 md:py-16" aria-labelledby="contact-cta-heading">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 id="contact-cta-heading" className="text-2xl font-bold text-foreground md:text-3xl">
            Let’s talk about your project
          </h2>
          <p className="mt-3 text-base text-foreground-muted">
            Share your goals and constraints. We reply within 24 hours.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact?intent=book-call"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Book a Call
            </Link>
            <Link
              href="/contact?intent=get-quote"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold text-foreground">Office Locations</h3>
          <ul className="mt-4 space-y-4 text-sm text-foreground-muted">
            <li><span className="font-semibold text-foreground">USA:</span> +1 (555) 010-1000</li>
            <li><span className="font-semibold text-foreground">UK:</span> +44 20 3000 9000</li>
            <li><span className="font-semibold text-foreground">Saudi Arabia:</span> +966 11 000 0000</li>
            <li><span className="font-semibold text-foreground">Pakistan:</span> +92 300 0000000</li>
            <li><span className="font-semibold text-foreground">Email:</span> hello@qtodev.com</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
