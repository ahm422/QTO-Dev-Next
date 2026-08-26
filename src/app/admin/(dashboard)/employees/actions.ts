"use server"

import { requireServerAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { employeeSchema, employeeBaseSchema, type EmployeeInput } from "@/lib/validators/employees/employee"
import { createEmployeeRecord } from "@/lib/employees/createEmployee"

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
  await prisma.employee.update({ where: { id }, data: parsed })
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteEmployee(id: string) {
  await requireEmployeeDeleteAction()
  await prisma.employee.delete({ where: { id } })
  await persistD1Bookmark()
}
