import Link from "next/link";
import { ProductsHeroSection } from "./sections/ProductsHeroSection";
import { ProductSection } from "./sections/ProductSection";
import { ProductsEmptyState } from "./sections/ProductsEmptyState";
import { CTA } from "@/components/common/CTA";
import { Container } from "@/components/common/Container";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { productsPageConfig } from "@/config/productsPage";
import { findPublishedProducts } from "@/lib/cms/products";
import { cn } from "@/components/theme/cn";

function ProductsOverview({
  products,
}: {
  products: Awaited<ReturnType<typeof findPublishedProducts>>;
}) {
  if (products.length === 0) return null;

  return (
    <section className="relative border-y border-border/70 bg-background/95">
      <Container className="py-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">
              Browse Products
            </p>
            <h2 className="text-2xl font-heading font-semibold text-foreground md:text-3xl">
              Explore published products in the order your team curates them
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground-muted md:text-base">
              Jump directly to a product section or scroll through the full lineup.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-surface px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Live Products
              </p>
              <p className="mt-2 text-2xl font-heading font-semibold text-foreground">
                {products.length}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-surface px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Total Modules
              </p>
              <p className="mt-2 text-2xl font-heading font-semibold text-foreground">
                {products.reduce((sum, product) => sum + product.features.length, 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-surface px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                First Section
              </p>
              <p className="mt-2 truncate text-base font-semibold text-foreground">
                {products[0]?.title}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`#${product.slug}`}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                "border-border/70 bg-surface text-foreground hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary"
              )}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span>{product.title}</span>
              <AppIcon
                name="arrow-right"
                size="xs"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default async function ProductsPage() {
  const products = await findPublishedProducts();
  const { cta } = productsPageConfig;
  const heroTarget =
    products.find((p) => p.slug === "construct-quest") ?? products[0];

  return (
    <>
      <ProductsHeroSection
        hero={{
          ctaHref: heroTarget ? `#${heroTarget.slug}` : null,
          ctaText: heroTarget
            ? `Explore ${heroTarget.title}`
            : productsPageConfig.hero.ctaText,
        }}
      />
      <ProductsOverview products={products} />
      {products.length === 0 ? (
        <ProductsEmptyState />
      ) : (
        products.map((product, index) => (
          <ProductSection key={product.id} product={product} index={index} />
        ))
      )}
      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
