"use client"

import RouteError from "@/components/common/RouteError"

export default function BlogsError({
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
      title="Couldn't load blog posts"
      description="Something went wrong while loading the blog. Please try again."
    />
  )
}
