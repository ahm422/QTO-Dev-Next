"use server"

import { requireServerAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { employeeSchema, employeeBaseSchema, type EmployeeInput } from "@/lib/validators/employees/employee"
import { createEmployeeRecord } from "@/lib/employees/createEmployee"
import { generateEmployeeQr } from "@/lib/employees/qr"

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

export async function updateEmployee(
  id: string,
  data: Partial<EmployeeInput>,
  opts: { regenerateQr?: boolean } = {},
) {
  await requireEmployeeAction()
  const parsed = employeeBaseSchema.partial().parse(data)
  const employee = await prisma.employee.update({
    where: { id },
    data: parsed,
    select: { id: true, publicId: true, qrKey: true },
  })

  // Backfill / refresh the QR: on first save it may never have been minted,
  // and older rows carry a QR baked with a stale (localhost) URL (#416).
  if (opts.regenerateQr || !employee.qrKey) {
    const { qrKey } = await generateEmployeeQr(employee.id, employee.publicId)
    if (qrKey && qrKey !== employee.qrKey) {
      await prisma.employee.update({ where: { id }, data: { qrKey } })
    }
  }

  await persistD1Bookmark()
  return { success: true }
}

export async function deleteEmployee(id: string) {
  await requireEmployeeDeleteAction()
  await prisma.employee.delete({ where: { id } })
  await persistD1Bookmark()
}
