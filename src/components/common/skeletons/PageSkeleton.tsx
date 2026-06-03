import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
  return (
    <>
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-4">
          <Skeleton className="h-12 w-2/3 max-w-lg" />
          <Skeleton className="h-6 w-full max-w-xl" />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-0">
      <section className="relative min-h-[70vh] flex items-center">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full py-16 space-y-6">
          <Skeleton className="h-14 w-4/5 max-w-2xl" />
          <Skeleton className="h-6 w-full max-w-xl" />
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </section>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 space-y-6">
          <Skeleton className="h-9 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
