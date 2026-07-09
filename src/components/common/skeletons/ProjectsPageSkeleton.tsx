import { Container } from "@/components/common/Container";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsPageSkeleton() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-32 lg:py-36 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="mt-6 h-12 w-2/3 max-w-lg" />
          <Skeleton className="mt-4 h-6 w-full max-w-xl" />
        </div>
      </section>

      {/* Filter pills */}
      <section className="py-8 bg-surface border-b border-border">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </Container>
      </section>

      {/* Grid section */}
      <section className="relative py-20 md:py-28 bg-surface-muted border-y border-border">
        <Container>
          <div className="mb-14 md:mb-16 space-y-4">
            <Skeleton className="h-8 w-36 rounded-full" />
            <Skeleton className="h-10 w-2/3 max-w-md" />
            <Skeleton className="h-5 w-full max-w-xl" />
            <Skeleton className="h-5 w-3/4 max-w-lg" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/80 bg-surface overflow-hidden"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="p-5 sm:p-6 space-y-3">
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Value section */}
      <section className="relative py-20 md:py-28 bg-surface-muted border-y border-border">
        <Container>
          <div className="mb-12 md:mb-16 space-y-4">
            <Skeleton className="h-8 w-44 rounded-full" />
            <Skeleton className="h-10 w-2/3 max-w-sm" />
            <Skeleton className="h-5 w-full max-w-lg" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-surface p-6 md:p-7 space-y-4"
              >
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="relative py-16 md:py-20 bg-primary/10">
        <Container>
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <Skeleton className="mx-auto h-10 w-2/3 max-w-sm" />
            <Skeleton className="mx-auto h-5 w-full max-w-md" />
            <Skeleton className="mx-auto h-11 w-36 rounded-full" />
          </div>
        </Container>
      </section>
    </>
  );
}
