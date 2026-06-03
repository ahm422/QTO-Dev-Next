import { Skeleton } from "@/components/ui/skeleton"

export function ProjectsPageSkeleton() {
  return (
    <>
      <section className="relative py-24 md:py-32 lg:py-36 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <Skeleton className="h-12 w-2/3 max-w-lg" />
          <Skeleton className="mt-4 h-6 w-full max-w-xl" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full" />
          ))}
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden">
              <Skeleton className="h-52 w-full rounded-none" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-4/5" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
