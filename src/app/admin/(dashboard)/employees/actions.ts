"use server"

import { revalidateTag } from "next/cache"
import { requireServerAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { employeeSchema, employeeBaseSchema, type EmployeeInput } from "@/lib/validators/employees/employee"
import { createEmployeeRecord } from "@/lib/employees/createEmployee"
import { generateEmployeeQr } from "@/lib/employees/qr"
import { EMPLOYEE_PUBLIC_CARD_TAG } from "@/lib/employees/publicCard"

const EMPLOYEE_ROLES = ["super_admin", "hr"] as const

const requireEmployeeAction = () => requireServerAction([...EMPLOYEE_ROLES])
const requireEmployeeDeleteAction = () => requireServerAction(["super_admin"])

export async function createEmployee(data: EmployeeInput) {
  const session = await requireEmployeeAction()
  const parsed = employeeSchema.parse(data)
  const employee = await createEmployeeRecord(parsed, { createdBy: session.user.id })
  await persistD1Bookmark()
  return { success: true, id: employee.id }
}

export async function updateEmployee(id: string, data: Partial<EmployeeInput>) {
  await requireEmployeeAction()
  const parsed = employeeBaseSchema.partial().parse(data)
  const employee = await prisma.employee.update({
    where: { id },
    data: parsed,
    select: { id: true, publicId: true, qrKey: true },
  })

  // First-mint backfill only: a row that has never had a QR gets one now. An
  // existing QR is never re-minted — it is printed on physical employee cards
  // and must stay byte-stable for the life of the card.
  if (!employee.qrKey) {
    const { qrKey } = await generateEmployeeQr(employee.id, employee.publicId)
    if (qrKey) {
      await prisma.employee.update({ where: { id }, data: { qrKey } })
    }
  }

  // Drop the public image-proxy asset cache so a status / photo / QR change
  // (incl. a deactivation) is reflected within the freshness window.
  revalidateTag(EMPLOYEE_PUBLIC_CARD_TAG, "max")
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteEmployee(id: string) {
  await requireEmployeeDeleteAction()
  await prisma.employee.delete({ where: { id } })
  revalidateTag(EMPLOYEE_PUBLIC_CARD_TAG, "max")
  await persistD1Bookmark()
}
