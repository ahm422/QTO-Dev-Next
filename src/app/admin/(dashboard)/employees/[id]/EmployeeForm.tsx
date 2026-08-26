"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formResolver } from "@/lib/admin/formResolver"
import { employeeSchema, EMPLOYEE_STATUSES, type EmployeeInput } from "@/lib/validators/employees/employee"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import EmployeePhotoUpload from "@/components/employees/EmployeePhotoUpload"
import EmployeeCard from "@/components/employees/EmployeeCard"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createEmployee, updateEmployee } from "../actions"
import type { Employee } from "@prisma/client"

function toDateInputValue(value: Date | string | null | undefined): string {
  if (!value) return ""
  const iso = value instanceof Date ? value.toISOString() : value
  return iso.split("T")[0] ?? ""
}

export default function EmployeeForm({
  defaultValues,
  photoUrl,
  qrUrl,
}: {
  defaultValues?: Employee
  photoUrl?: string | null
  qrUrl?: string | null
}) {
  const router = useRouter()
  const isEdit = !!defaultValues?.id

  const form = useForm<EmployeeInput>({
    resolver: formResolver(employeeSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          email: defaultValues.email ?? "",
          phone: defaultValues.phone ?? "",
          designation: defaultValues.designation ?? "",
          department: defaultValues.department ?? "",
          team: defaultValues.team ?? "",
          officeAddress: defaultValues.officeAddress ?? "",
          emergencyContactName: defaultValues.emergencyContactName ?? "",
          emergencyContactPhone: defaultValues.emergencyContactPhone ?? "",
          emergencyContactRelation: defaultValues.emergencyContactRelation ?? "",
          status: (defaultValues.status as EmployeeInput["status"]) ?? "active",
          // Prisma DateTimes → yyyy-MM-dd for <input type="date">, coerced back on submit.
          dob: toDateInputValue(defaultValues.dob) as unknown as EmployeeInput["dob"],
          cnicIssueDate: toDateInputValue(defaultValues.cnicIssueDate) as unknown as EmployeeInput["cnicIssueDate"],
          cnicExpiryDate: toDateInputValue(defaultValues.cnicExpiryDate) as unknown as EmployeeInput["cnicExpiryDate"],
          joiningDate: toDateInputValue(defaultValues.joiningDate) as unknown as EmployeeInput["joiningDate"],
        }
      : {
          employeeCode: "",
          name: "",
          designation: "",
          department: "",
          team: "",
          status: "active",
          email: "",
          phone: "",
          cnic: "",
          officeAddress: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelation: "",
          photoKey: null,
        },
  })
  const { isSubmitting } = form.formState
  const previewName = form.watch("name")
  const previewDesignation = form.watch("designation")
  const previewEmployeeCode = form.watch("employeeCode")
  const previewDepartment = form.watch("department")

  async function onSubmit(data: EmployeeInput) {
    try {
      if (isEdit) await updateEmployee(defaultValues.id, data)
      else await createEmployee(data)
      router.push("/admin/employees")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px] items-start">
          <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/employees">
            <FormGrid cols={2}>
              <FormField control={form.control} name="employeeCode" render={({ field }) => (
                <FormItem><FormLabel>Employee Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </FormGrid>
            <FormGrid cols={2}>
              <FormField control={form.control} name="designation" render={({ field }) => (
                <FormItem><FormLabel>Designation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {EMPLOYEE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s[0]?.toUpperCase() + s.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </FormGrid>
            <FormGrid cols={2}>
              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="team" render={({ field }) => (
                <FormItem><FormLabel>Team</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </FormGrid>
            <FormGrid cols={2}>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </FormGrid>

            <FormField control={form.control} name="photoKey" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <EmployeePhotoUpload value={field.value} onChange={field.onChange} initialUrl={photoUrl} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormGrid cols={2}>
              <FormField control={form.control} name="cnic" render={({ field }) => (
                <FormItem><FormLabel>CNIC</FormLabel><FormControl><Input {...field} placeholder="12345-1234567-1" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dob" render={({ field }) => (
                <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input {...field} value={(field.value as unknown as string) ?? ""} type="date" /></FormControl><FormMessage /></FormItem>
              )} />
            </FormGrid>
            <FormGrid cols={2}>
              <FormField control={form.control} name="cnicIssueDate" render={({ field }) => (
                <FormItem><FormLabel>CNIC Issue Date</FormLabel><FormControl><Input {...field} value={(field.value as unknown as string) ?? ""} type="date" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cnicExpiryDate" render={({ field }) => (
                <FormItem><FormLabel>CNIC Expiry Date</FormLabel><FormControl><Input {...field} value={(field.value as unknown as string) ?? ""} type="date" /></FormControl><FormMessage /></FormItem>
              )} />
            </FormGrid>
            <FormField control={form.control} name="joiningDate" render={({ field }) => (
              <FormItem><FormLabel>Joining Date</FormLabel><FormControl><Input {...field} value={(field.value as unknown as string) ?? ""} type="date" /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="officeAddress" render={({ field }) => (
              <FormItem><FormLabel>Office Address</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormGrid cols={3}>
              <FormField control={form.control} name="emergencyContactName" render={({ field }) => (
                <FormItem><FormLabel>Emergency Contact</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="emergencyContactPhone" render={({ field }) => (
                <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="emergencyContactRelation" render={({ field }) => (
                <FormItem><FormLabel>Relation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </FormGrid>
          </AdminForm>

          <div className="lg:sticky lg:top-6">
            <p className="text-xs font-medium text-muted-foreground mb-2">Card preview</p>
            <EmployeeCard
              name={previewName || "Employee Name"}
              designation={previewDesignation}
              employeeCode={previewEmployeeCode || "—"}
              department={previewDepartment}
              photoUrl={photoUrl}
              qrUrl={qrUrl}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
