import { Skeleton } from "@/components/ui/skeleton"

export function RelatedArticlesSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <Skeleton className="h-9 w-64 mx-auto rounded-xl" />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-surface rounded-lg border border-border overflow-hidden"
          >
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-3/6" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
