import { Skeleton } from "@/components/ui/skeleton"

interface DetailHeroSkeletonProps {
  showSidebar?: boolean
  contentLines?: number
}

export function DetailHeroSkeleton({
  showSidebar = true,
  contentLines = 10,
}: DetailHeroSkeletonProps) {
  return (
    <article className="min-h-screen bg-background">
      <header className="pt-24 md:pt-32 pb-12 md:pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Skeleton className="h-4 w-64" />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-4">
              <Skeleton className="h-12 w-5/6 rounded-xl" />
              <Skeleton className="h-12 w-4/6 rounded-xl" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <Skeleton className="h-64 md:h-80 lg:h-96 w-full rounded-lg" />
          </div>
        </div>
      </header>

      {showSidebar ? (
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: contentLines }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-5"
                  style={{ width: `${90 - (i % 3) * 12}%` }}
                />
              ))}
            </div>
            <aside className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </aside>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 lg:py-16 space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
