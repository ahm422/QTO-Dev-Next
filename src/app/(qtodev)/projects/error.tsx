"use client"

import RouteError from "@/components/common/RouteError"

export default function ProjectsError({
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
      title="Couldn't load projects"
      description="Something went wrong while loading projects. Please try again."
    />
  )
}
