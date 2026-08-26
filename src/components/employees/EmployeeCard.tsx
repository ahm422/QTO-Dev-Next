import Image from "next/image"
import { BadgeCheck, ScanLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { SITE_NAME } from "@/lib/constants"

export interface EmployeeCardProps {
  name: string
  designation?: string | null
  employeeCode: string
  department?: string | null
  team?: string | null
  status?: string | null
  /** Resolved photo URL — callers decide how to resolve it (admin preview
   * can use a direct R2 URL; the public page must proxy it, never emitting
   * a raw R2 URL — see #414 Phase 04). */
  photoUrl?: string | null
  /** Resolved QR PNG URL. */
  qrUrl?: string | null
  className?: string
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-[var(--admin-success)]/15 text-[var(--admin-success)] ring-1 ring-inset ring-[var(--admin-success)]/30",
  inactive: "bg-[var(--admin-warning)]/15 text-[var(--admin-warning)] ring-1 ring-inset ring-[var(--admin-warning)]/30",
  terminated: "bg-destructive/15 text-destructive ring-1 ring-inset ring-destructive/30",
}

/**
 * Single shared card component rendered both in the admin EmployeeForm's
 * live preview (Phase 03) and on the public /employee/[publicId] page
 * (Phase 04) — keeping these in one place is what stops the two surfaces'
 * markup from drifting.
 */
export default function EmployeeCard({
  name,
  designation,
  employeeCode,
  department,
  team,
  status,
  photoUrl,
  qrUrl,
  className,
}: EmployeeCardProps) {
  const statusKey = status?.toLowerCase()
  const statusStyle = statusKey ? STATUS_STYLES[statusKey] : undefined

  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/5",
        className,
      )}
    >
      {/* Header band */}
      <div className="relative bg-gradient-to-br from-primary to-primary/70 px-5 pt-5 pb-12">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-primary-foreground/85">
            <BadgeCheck className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              {SITE_NAME} · Employee ID
            </span>
          </div>
          {status && (
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize backdrop-blur-sm",
                statusStyle ?? "bg-white/20 text-primary-foreground",
              )}
            >
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Avatar overlapping the header band */}
      <div className="flex flex-col items-center px-5 -mt-10">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-card bg-muted shadow-md">
          {photoUrl ? (
            <Image src={photoUrl} alt={name} width={80} height={80} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-semibold text-primary">
              {name.trim().charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div className="mt-3 min-w-0 text-center">
          <p className="truncate text-lg font-semibold leading-tight text-foreground">{name}</p>
          {designation && <p className="truncate text-sm text-muted-foreground">{designation}</p>}
          {(department || team) && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
              {department && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                  {department}
                </span>
              )}
              {team && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {team}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 w-full rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Employee Code</p>
          <p className="font-mono text-sm font-semibold tabular-nums text-foreground">{employeeCode}</p>
        </div>
      </div>

      {qrUrl && (
        <div className="mt-5 flex flex-col items-center gap-2 border-t border-border bg-muted/20 px-5 py-4">
          <div className="h-28 w-28 shrink-0 rounded-lg border border-border bg-white p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- opaque R2 key, not an optimizable static asset */}
            <img src={qrUrl} alt="Employee QR code" className="h-full w-full object-contain" />
          </div>
          <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <ScanLine className="h-3 w-3" />
            Scan to view profile
          </p>
        </div>
      )}
    </div>
  )
}
