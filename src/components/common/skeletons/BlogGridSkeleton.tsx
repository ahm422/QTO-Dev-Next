import { Skeleton } from "@/components/ui/skeleton"

interface BlogGridSkeletonProps {
  cardCount?: number
  showFilters?: boolean
}

export function BlogGridSkeleton({ cardCount = 9, showFilters = true }: BlogGridSkeletonProps) {
  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-16 md:pt-20 pb-10">
        <Skeleton className="h-10 w-56 rounded-xl" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        <Skeleton className="mt-2 h-5 w-3/4 max-w-lg" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        {showFilters && (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-full" />
            ))}
          </div>
        )}

        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${showFilters ? "mt-10" : ""}`}>
          {Array.from({ length: cardCount }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/70 bg-background overflow-hidden"
            >
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-3/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
