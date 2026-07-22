"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import ActivityFeed, { type RecentActivityItem } from "@/components/admin/data/ActivityFeed"

interface RecentActivityCardProps {
  /** Number of items to request from the endpoint. */
  limit?: number
}

function FeedSkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 py-2.5">
          <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RecentActivityCard({ limit = 10 }: Readonly<RecentActivityCardProps>) {
  const [items, setItems] = useState<RecentActivityItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/admin/dashboard/recent-activity?limit=${limit}`, {
        credentials: "include",
      })
      const body = (await res.json().catch(() => null)) as
        | { success: boolean; details?: { items?: RecentActivityItem[] } }
        | null
      if (!res.ok || !body?.success || !body.details?.items) {
        setError(true)
        return
      }
      setItems(body.details.items)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <FeedSkeleton />

  if (error || !items) {
    return (
      <div className="flex flex-col items-start gap-3 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-[var(--admin-warning)]" />
          Couldn&apos;t load recent activity.
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    )
  }

  return <ActivityFeed items={items} />
}
