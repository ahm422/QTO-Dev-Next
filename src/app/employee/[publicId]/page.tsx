import { notFound } from "next/navigation"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { getPublicEmployeeCard } from "@/lib/employees/publicCard"
import { getPublicUrl } from "@/lib/garage"
import { checkRateLimit } from "@/lib/rateLimit"
import EmployeeCard from "@/components/employees/EmployeeCard"

// No cache — a terminated/deactivated employee's card must stop resolving
// immediately, not after a stale render is served.
export const dynamic = "force-dynamic"

const RATE_LIMIT = { limit: 30, windowSeconds: 300 } // 30 req / 5 min per IP

function detailRow(label: string, value: string | null | undefined) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  )
}

export default async function PublicEmployeeCardPage({
  params,
}: {
  params: Promise<{ publicId: string }>
}) {
  const { publicId } = await params

  // checkRateLimit only reads `.headers.get(...)` off its `request` param,
  // so the read-only Headers from next/headers() satisfies it here — Server
  // Components don't get a NextRequest.
  const requestLike = { headers: await headers() } as unknown as NextRequest
  const rateLimit = await checkRateLimit({
    request: requestLike,
    routeKey: "employee-public-card",
    config: RATE_LIMIT,
  })
  if (!rateLimit.allowed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Too many requests. Please try again shortly.</p>
      </main>
    )
  }

  const card = await getPublicEmployeeCard(publicId)
  // Identical response whether publicId is unknown or the employee is
  // inactive/terminated — one code path, no branch that leaks which.
  if (!card) notFound()

  const photoUrl = card.photoKey ? `/api/employee-public/${card.publicId}/photo` : null
  const qrUrl = card.qrKey ? getPublicUrl(card.qrKey) : null

  return (
    <main className="min-h-screen flex flex-col items-center gap-6 p-6 py-12">
      <EmployeeCard
        name={card.name}
        designation={card.designation}
        employeeCode={card.employeeCode}
        department={card.department}
        team={card.team}
        status="active"
        photoUrl={photoUrl}
        qrUrl={qrUrl}
      />
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-sm">
        {detailRow("Email", card.email)}
        {detailRow("Phone", card.phone)}
        {detailRow("CNIC", card.cnic)}
        {detailRow("Office Address", card.officeAddress)}
        {detailRow("Emergency Contact", card.emergencyContactName)}
        {detailRow("Emergency Phone", card.emergencyContactPhone)}
        {detailRow("Relation", card.emergencyContactRelation)}
      </div>
    </main>
  )
}
