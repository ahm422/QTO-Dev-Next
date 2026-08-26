import Image from "next/image"
import { cn } from "@/lib/utils"

export interface EmployeeCardProps {
  name: string
  designation?: string | null
  employeeCode: string
  department?: string | null
  /** Resolved photo URL — callers decide how to resolve it (admin preview
   * can use a direct R2 URL; the public page must proxy it, never emitting
   * a raw R2 URL — see #414 Phase 04). */
  photoUrl?: string | null
  /** Resolved QR PNG URL. */
  qrUrl?: string | null
  className?: string
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
  photoUrl,
  qrUrl,
  className,
}: EmployeeCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-xs rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col items-center gap-4 text-center",
        className,
      )}
    >
      <div className="h-24 w-24 rounded-full overflow-hidden bg-muted border border-border shrink-0">
        {photoUrl ? (
          <Image src={photoUrl} alt={name} width={96} height={96} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-2xl font-semibold text-muted-foreground">
            {name.trim().charAt(0).toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground truncate">{name}</p>
        {designation && <p className="text-sm text-muted-foreground truncate">{designation}</p>}
        {department && <p className="text-xs text-muted-foreground truncate">{department}</p>}
        <p className="text-xs text-muted-foreground mt-1 tabular-nums">{employeeCode}</p>
      </div>

      {qrUrl && (
        <div className="h-28 w-28 rounded-lg border border-border bg-white p-1.5 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- opaque R2 key, not an optimizable static asset */}
          <img src={qrUrl} alt="Employee QR code" className="h-full w-full object-contain" />
        </div>
      )}
    </div>
  )
}
