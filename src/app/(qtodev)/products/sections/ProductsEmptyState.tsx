import { Container } from "@/components/common/Container";
import Link from "next/link";

const HEADING_ID = "products-empty-heading";

export function ProductsEmptyState() {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden bg-surface border-y border-border"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-border/70 bg-background/80 px-6 py-10 text-center shadow-xl shadow-black/5 backdrop-blur-sm md:px-10 md:py-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">
            Nothing Live Yet
          </p>
          <h2
            className="text-2xl font-heading font-semibold text-foreground md:text-4xl"
            id={HEADING_ID}
          >
            Products will appear here as soon as they are published
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground-muted md:text-lg">
            This page is connected to the CMS, so newly published products will
            show up here automatically in the chosen order.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
            >
              Contact Our Team
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
