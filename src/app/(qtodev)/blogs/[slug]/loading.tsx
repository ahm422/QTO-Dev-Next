export default function BlogDetailLoading() {
  return (
    <article className="min-h-screen bg-background">
      <header className="pt-24 md:pt-32 pb-12 md:pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-4 w-64 rounded bg-surface-muted/70 animate-pulse" />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-4">
              <div className="h-12 w-5/6 rounded-xl bg-surface-muted/80 animate-pulse" />
              <div className="h-12 w-4/6 rounded-xl bg-surface-muted/80 animate-pulse" />
              <div className="h-5 w-2/3 rounded-lg bg-surface-muted/70 animate-pulse" />
              <div className="h-5 w-1/2 rounded-lg bg-surface-muted/70 animate-pulse" />
            </div>
            <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-surface-muted/70 animate-pulse" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-5 rounded-lg bg-surface-muted/70 animate-pulse"
                style={{ width: `${90 - (i % 3) * 12}%` }}
              />
            ))}
          </div>
          <aside className="space-y-4">
            <div className="h-8 w-1/2 rounded-lg bg-surface-muted/70 animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-surface-muted/70 animate-pulse" />
            ))}
          </aside>
        </div>
      </div>
    </article>
  );
}

