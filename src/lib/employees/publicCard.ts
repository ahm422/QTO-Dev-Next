import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";

/** Tag busted whenever an employee's status / photoKey / qrKey changes, so the
 * proxy-route asset cache below drops within the freshness window. */
export const EMPLOYEE_PUBLIC_CARD_TAG = "employee-public-card";

/**
 * Server-side allowlist projection for the unauthenticated public employee
 * card (#414 Phase 04, locked decision: full source allowlist — CNIC,
 * phone, office address, emergency contacts all render on this page;
 * #416 adds blood group + joining date). DOB and CNIC issue/expiry dates
 * are deliberately NOT here — admin-only. Only these columns ever leave the
 * query — never spread a full Employee row into a public response.
 */
const PUBLIC_CARD_SELECT = {
  publicId: true,
  employeeCode: true,
  name: true,
  designation: true,
  department: true,
  team: true,
  email: true,
  phone: true,
  cnic: true,
  bloodGroup: true,
  officeAddress: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
  emergencyContactRelation: true,
  joiningDate: true,
  photoKey: true,
  qrKey: true,
  status: true,
} as const;

async function loadPublicEmployeeCard(publicId: string) {
  return prisma.employee.findUnique({
    where: { publicId },
    select: PUBLIC_CARD_SELECT,
  });
}

/**
 * Returns null identically whether publicId doesn't exist or the employee
 * is inactive/terminated — one code path, no branch that leaks which
 * (#414 Phase 04: "identical not-found response... no branch that leaks
 * which").
 */
export const getPublicEmployeeCard = cache(_getPublicEmployeeCard);

async function _getPublicEmployeeCard(publicId: string) {
  const employee = await loadPublicEmployeeCard(publicId);
  if (!employee || employee.status !== "active") return null;
  return {
    publicId: employee.publicId,
    employeeCode: employee.employeeCode,
    name: employee.name,
    designation: employee.designation,
    department: employee.department,
    team: employee.team,
    email: employee.email,
    phone: employee.phone,
    cnic: employee.cnic,
    bloodGroup: employee.bloodGroup,
    officeAddress: employee.officeAddress,
    emergencyContactName: employee.emergencyContactName,
    emergencyContactPhone: employee.emergencyContactPhone,
    emergencyContactRelation: employee.emergencyContactRelation,
    joiningDate: employee.joiningDate,
    photoKey: employee.photoKey,
    qrKey: employee.qrKey,
  };
}

export type PublicEmployeeCard = NonNullable<Awaited<ReturnType<typeof getPublicEmployeeCard>>>;

/**
 * Minimal photoKey/qrKey lookup for the image proxy routes
 * (`/api/employee-public/[publicId]/photo` and `/qr`). Persistently cached
 * (KV-backed unstable_cache) so repeated image requests for one scan don't
 * each hit D1 — the routes were re-running the full card query per request.
 *
 * Returns null identically for unknown or inactive/terminated employees, so
 * the routes keep 404-ing with the same not-found parity as the card page.
 * The <=60s staleness only affects images: the card page itself stays
 * `force-dynamic`, so a deactivated card never renders and these URLs are
 * never handed out. `updateEmployee` busts EMPLOYEE_PUBLIC_CARD_TAG anyway.
 */
export const getPublicCardAssets = cache(
  unstable_cache(
    async (publicId: string) => {
      const row = await (await getCachedReadPrisma()).employee.findUnique({
        where: { publicId },
        select: { photoKey: true, qrKey: true, status: true },
      });
      if (!row || row.status !== "active") return null;
      return { photoKey: row.photoKey, qrKey: row.qrKey };
    },
    ["employee-public-card-assets"],
    { revalidate: 60, tags: [EMPLOYEE_PUBLIC_CARD_TAG] },
  ),
);
