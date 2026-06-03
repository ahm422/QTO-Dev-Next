"use client"

import RouteError from "@/components/common/RouteError"

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="Couldn't load this article"
      description="We had trouble loading this blog post. Please try again."
    />
  )
}
