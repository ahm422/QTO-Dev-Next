"use client"

import RouteError from "@/components/common/RouteError"

export default function ProjectDetailError({
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
      title="Couldn't load this project"
      description="We had trouble loading this case study. Please try again."
    />
  )
}
