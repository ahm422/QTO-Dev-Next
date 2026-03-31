export default function BlogsLoading() {
  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-16 md:pt-20 pb-10">
        <div className="h-10 w-56 rounded-xl bg-surface-muted/80 animate-pulse" />
        <div className="mt-4 h-5 w-full max-w-xl rounded-lg bg-surface-muted/70 animate-pulse" />
        <div className="mt-2 h-5 w-3/4 max-w-lg rounded-lg bg-surface-muted/70 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 rounded-full bg-surface-muted/70 animate-pulse"
            />
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/70 bg-background overflow-hidden"
            >
              <div className="h-44 bg-surface-muted/70 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-24 rounded bg-surface-muted/70 animate-pulse" />
                <div className="h-6 w-5/6 rounded bg-surface-muted/70 animate-pulse" />
                <div className="h-4 w-4/6 rounded bg-surface-muted/70 animate-pulse" />
                <div className="h-4 w-3/6 rounded bg-surface-muted/70 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

