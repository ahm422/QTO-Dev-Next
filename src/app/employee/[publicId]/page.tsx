import { notFound } from "next/navigation"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { getPublicEmployeeCard } from "@/lib/employees/publicCard"
import { checkRateLimit } from "@/lib/rateLimit"
import { SITE_URL } from "@/lib/constants"
import EmployeeCard from "@/components/employees/EmployeeCard"

// No cache — a terminated/deactivated employee's card must stop resolving
// immediately, not after a stale render is served.
export const dynamic = "force-dynamic"

const RATE_LIMIT = { limit: 30, windowSeconds: 300 } // 30 req / 5 min per IP

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
  const qrUrl = card.qrKey ? `/api/employee-public/${card.publicId}/qr` : null

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
        publicUrl={`${SITE_URL.replace(/\/$/, "")}/employee/${card.publicId}`}
        phone={card.phone}
        officeAddress={card.officeAddress}
        cnic={card.cnic}
        bloodGroup={card.bloodGroup}
        joiningDate={card.joiningDate}
        emergencyContactName={card.emergencyContactName}
        emergencyContactPhone={card.emergencyContactPhone}
        emergencyContactRelation={card.emergencyContactRelation}
      />
    </main>
  )
}
