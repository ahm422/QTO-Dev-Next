"use client"

import RouteError from "@/components/common/RouteError"

export default function ServiceDetailError({
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
      title="Couldn't load this service"
      description="We had trouble loading this service page. Please try again."
    />
  )
}
