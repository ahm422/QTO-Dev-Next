import { prisma } from "@/lib/prisma";

/**
 * Server-side allowlist projection for the unauthenticated public employee
 * card (#414 Phase 04, locked decision: full source allowlist — CNIC,
 * phone, office address, emergency contacts all render on this page).
 * Only these columns ever leave the query — never spread a full Employee
 * row into a public response.
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
export async function getPublicEmployeeCard(publicId: string) {
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
