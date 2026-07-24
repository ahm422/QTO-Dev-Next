import { Skeleton } from "@/components/ui/skeleton"

export function ServiceDetailSkeleton() {
  return (
    <main className="scroll-smooth bg-background text-foreground">
      <section className="relative border-b border-border py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <Skeleton className="h-4 w-72" />
          <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <Skeleton className="h-14 w-full max-w-xl rounded-xl" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-2/3" />
              <div className="flex flex-wrap gap-2 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            </div>
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 md:px-6 lg:px-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-full max-w-2xl" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-36 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
