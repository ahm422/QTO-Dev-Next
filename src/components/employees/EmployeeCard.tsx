import type { ReactNode } from "react"
import Image from "next/image"
import { BadgeCheck, ScanLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { SITE_NAME } from "@/lib/constants"

type Dateish = Date | string | null | undefined

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
  /** Resolved QR PNG URL (public page → proxy route). Ignored when `qrNode`
   * is supplied. */
  qrUrl?: string | null
  /** Pre-rendered QR node — the admin preview passes a live client-side
   * <EmployeeQrPreview> so the code is correct before the row is saved. */
  qrNode?: ReactNode
  /** Public card URL, shown under the QR as a scan hint. */
  publicUrl?: string | null

  phone?: string | null
  officeAddress?: string | null
  cnic?: string | null
  bloodGroup?: string | null
  joiningDate?: Dateish
  cnicIssueDate?: Dateish
  dob?: Dateish
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  emergencyContactRelation?: string | null

  /** Admin variant — surfaces fields kept off the public card (DOB, CNIC
   * issue date). These are never in the public projection, so this only
   * matters when a caller actually passes them. */
  admin?: boolean
  className?: string
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-[var(--admin-success)]/15 text-[var(--admin-success)] ring-1 ring-inset ring-[var(--admin-success)]/30",
  inactive: "bg-[var(--admin-warning)]/15 text-[var(--admin-warning)] ring-1 ring-inset ring-[var(--admin-warning)]/30",
  terminated: "bg-destructive/15 text-destructive ring-1 ring-inset ring-destructive/30",
}

function formatDate(value: Dateish): string | null {
  if (!value) return null
  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`)
      : value instanceof Date
        ? value
        : new Date(value)
  if (Number.isNaN(date.getTime())) return typeof value === "string" ? value : null
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function DetailRow({
  label,
  value,
  mono,
  full,
}: {
  label: string
  value: ReactNode
  mono?: boolean
  full?: boolean
}) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div className={cn("min-w-0", full && "col-span-2")}>
      <dt className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={cn("mt-0.5 break-words text-[11px] leading-snug text-foreground", mono && "font-mono tabular-nums")}>
        {value}
      </dd>
    </div>
  )
}

/**
 * Single shared card component rendered both in the admin EmployeeForm's
 * live preview (Phase 03) and on the public /employee/[publicId] page
 * (Phase 04) — keeping these in one place is what stops the two surfaces'
 * markup from drifting. Redesigned in #416 into a portrait ID badge with a
 * print-friendly stylesheet.
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
  qrNode,
  publicUrl,
  phone,
  officeAddress,
  cnic,
  bloodGroup,
  joiningDate,
  cnicIssueDate,
  dob,
  emergencyContactName,
  emergencyContactPhone,
  emergencyContactRelation,
  admin,
  className,
}: EmployeeCardProps) {
  const statusKey = status?.toLowerCase()
  const statusStyle = statusKey ? STATUS_STYLES[statusKey] : undefined
  const initial = name.trim().charAt(0).toUpperCase() || "?"

  const emergency = [emergencyContactName, emergencyContactRelation && `(${emergencyContactRelation})`, emergencyContactPhone]
    .filter(Boolean)
    .join(" ")

  const scanHost = (() => {
    if (!publicUrl) return null
    try {
      return new URL(publicUrl).host
    } catch {
      return null
    }
  })()

  const hasQr = Boolean(qrNode || qrUrl)

  return (
    <div
      data-employee-badge
      className={cn(
        "flex w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg shadow-black/5",
        "print:max-w-none print:rounded-none print:border print:border-black print:bg-white print:text-black print:shadow-none",
        className,
      )}
    >
      {/* Header band */}
      <div className="relative bg-gradient-to-br from-primary to-primary/70 px-5 pt-4 pb-10 print:bg-white print:pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-primary-foreground/90 print:text-black">
            <BadgeCheck className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">{SITE_NAME} · Employee ID</span>
          </div>
          {status && (
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize backdrop-blur-sm print:ring-1 print:ring-black",
                statusStyle ?? "bg-white/20 text-primary-foreground",
              )}
            >
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Identity */}
      <div className="flex flex-col items-center px-5 -mt-8">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-card bg-muted shadow-md print:border-black">
          {photoUrl ? (
            <Image src={photoUrl} alt={name} width={96} height={96} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-semibold text-primary print:bg-white print:text-black">
              {initial}
            </div>
          )}
        </div>

        <div className="mt-2.5 min-w-0 text-center">
          <p className="truncate text-lg font-semibold leading-tight text-foreground">{name}</p>
          {designation && <p className="truncate text-sm text-muted-foreground print:text-black">{designation}</p>}
          {(department || team) && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
              {department && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground print:ring-1 print:ring-black">
                  {department}
                </span>
              )}
              {team && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground print:ring-1 print:ring-black">
                  {team}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail grid */}
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 px-5">
        <DetailRow label="Employee ID" value={employeeCode} mono />
        <DetailRow label="Blood Group" value={bloodGroup} mono />
        <DetailRow label="Joining Date" value={formatDate(joiningDate)} />
        <DetailRow label="CNIC" value={cnic} mono />
        {admin && <DetailRow label="Date of Birth" value={formatDate(dob)} />}
        {admin && <DetailRow label="CNIC Issued" value={formatDate(cnicIssueDate)} />}
        <DetailRow label="Contact Number" value={phone} mono />
        <DetailRow label="Company Address" value={officeAddress} full />
        <DetailRow label="Emergency Contact" value={emergency || null} full />
      </dl>

      {/* QR footer */}
      {hasQr ? (
        <div className="mt-4 flex flex-col items-center gap-2 border-t border-border bg-muted/20 px-5 py-4 print:border-black print:bg-white">
          <div className="h-28 w-28 shrink-0 rounded-lg border border-border bg-white p-1.5 print:border-black">
            {qrNode ?? (
              // eslint-disable-next-line @next/next/no-img-element -- proxied QR route / opaque key, not an optimizable static asset
              <img src={qrUrl ?? undefined} alt="Employee QR code" className="h-full w-full object-contain" />
            )}
          </div>
          <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground print:text-black">
            <ScanLine className="h-3 w-3" />
            Scan to view profile
          </p>
          {scanHost && <p className="text-[10px] text-muted-foreground print:text-black">{scanHost}</p>}
        </div>
      ) : (
        <div className="mt-4 pb-4" />
      )}
    </div>
  )
}
