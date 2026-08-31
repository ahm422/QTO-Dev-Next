import type { ReactNode } from "react"
import {
  BadgeCheck,
  ScanLine,
  IdCard,
  Droplet,
  CalendarDays,
  Fingerprint,
  Cake,
  Stamp,
  Phone,
  MapPin,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react"
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
  icon: Icon,
  label,
  value,
  mono,
  wrap,
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
  mono?: boolean
  wrap?: boolean
}) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary print:bg-white print:ring-1 print:ring-black print:text-black">
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground print:text-black">
          {label}
        </span>
        <span
          className={cn(
            "block text-[12px] font-medium leading-tight text-foreground print:text-black",
            wrap ? "break-words" : "truncate",
            mono && "font-mono tracking-tight",
          )}
        >
          {value}
        </span>
      </span>
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
        "flex w-full max-w-[360px] flex-col overflow-hidden rounded-[26px] bg-card text-card-foreground",
        "ring-1 ring-black/5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.28)]",
        "print:max-w-none print:rounded-none print:bg-white print:text-black print:shadow-none print:ring-1 print:ring-black",
        className,
      )}
    >
      {/* Header band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 px-5 pt-5 pb-5 print:bg-white print:pb-4">
        {/* decorative glints */}
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl print:hidden" />
        <div className="pointer-events-none absolute -left-10 -bottom-12 h-24 w-40 -rotate-12 bg-white/10 blur-xl print:hidden" />

        <div className="relative flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-primary-foreground print:text-black">
            <span className="flex size-6 items-center justify-center rounded-md bg-white/20 print:bg-white print:ring-1 print:ring-black">
              <BadgeCheck className="size-3.5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">{SITE_NAME}</span>
          </div>
          {status && (
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm print:ring-1 print:ring-black",
                statusStyle ?? "bg-white/20 text-primary-foreground",
              )}
            >
              {status}
            </span>
          )}
        </div>
        <p className="relative mt-1 text-[9px] font-semibold uppercase tracking-[0.32em] text-primary-foreground/70 print:text-black">
          Employee Identification
        </p>
      </div>

      {/* Identity */}
      <div className="flex flex-col items-center px-5 pt-5">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-muted ring-4 ring-card shadow-lg outline outline-1 outline-primary/25 print:ring-2 print:ring-black print:outline-0">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- photoUrl is either the access-controlled proxy route (public page) or a direct R2 URL (admin preview); neither is an optimizable static asset, and routing it through next/image stalls on the Cloudflare runtime (#418)
            <img
              src={photoUrl}
              alt={name}
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary print:bg-white print:text-black">
              {initial}
            </div>
          )}
        </div>

        <div className="mt-3 min-w-0 max-w-full text-center">
          <p className="truncate text-xl font-bold tracking-tight text-foreground">{name}</p>
          {designation && (
            <p className="truncate text-[13px] font-semibold text-primary print:text-black">{designation}</p>
          )}
          {(department || team) && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
              {department && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary print:ring-1 print:ring-black print:text-black">
                  {department}
                </span>
              )}
              {team && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground print:ring-1 print:ring-black print:text-black">
                  {team}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* perforation-style divider */}
      <div className="mx-5 mt-4 border-t border-dashed border-border" />

      {/* Detail list — one field per line */}
      <dl className="mt-1 divide-y divide-border/50 px-5">
        <DetailRow icon={IdCard} label="Employee ID" value={employeeCode} mono />
        <DetailRow icon={Droplet} label="Blood Group" value={bloodGroup} mono />
        <DetailRow icon={CalendarDays} label="Joining Date" value={formatDate(joiningDate)} />
        <DetailRow icon={Fingerprint} label="CNIC" value={cnic} mono />
        {admin && <DetailRow icon={Cake} label="Date of Birth" value={formatDate(dob)} />}
        {admin && <DetailRow icon={Stamp} label="CNIC Issued" value={formatDate(cnicIssueDate)} />}
        <DetailRow icon={Phone} label="Contact Number" value={phone} mono />
        <DetailRow icon={MapPin} label="Company Address" value={officeAddress} wrap />
        <DetailRow icon={ShieldAlert} label="Emergency Contact" value={emergency || null} wrap />
      </dl>

      {/* QR footer */}
      {hasQr ? (
        <div className="mt-3 flex items-center gap-4 border-t border-border bg-muted/40 px-5 py-4 print:border-black print:bg-white">
          <div className="size-[120px] shrink-0 rounded-xl bg-white p-2 ring-1 ring-black/10 print:ring-black">
            {qrNode ?? (
              // eslint-disable-next-line @next/next/no-img-element -- proxied QR route / opaque key, not an optimizable static asset
              <img src={qrUrl ?? undefined} alt="Employee QR code" className="h-full w-full object-contain" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground print:text-black">
              <ScanLine className="size-3.5 text-primary print:text-black" />
              Scan to verify
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground print:text-black">Opens this employee&apos;s live profile</p>
            {scanHost && (
              <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground print:text-black">{scanHost}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 pb-3" />
      )}

      {/* base accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/50 to-primary print:hidden" />
    </div>
  )
}
