"use client"

import RouteError from "@/components/common/RouteError"

export default function AdminError({
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
      title="Admin error"
      description="Something went wrong in the admin dashboard. Try again or sign in again if the problem persists."
    />
  )
}
