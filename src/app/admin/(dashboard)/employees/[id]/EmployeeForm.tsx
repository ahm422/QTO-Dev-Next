"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { User, Building2, Phone, IdCard, ShieldAlert, Eye } from "lucide-react"
import { formResolver } from "@/lib/admin/formResolver"
import {
  employeeSchema,
  EMPLOYEE_STATUSES,
  BLOOD_GROUPS,
  type EmployeeInput,
} from "@/lib/validators/employees/employee"
import { formatCnic } from "@/lib/employees/formatCnic"
import { SITE_URL } from "@/lib/constants"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid, { FormGridSpan } from "@/components/admin/forms/FormGrid"
import FormSection from "@/components/admin/forms/FormSection"
import EmployeePhotoUpload from "@/components/employees/EmployeePhotoUpload"
import EmployeeCard from "@/components/employees/EmployeeCard"
import EmployeeQrPreview from "@/components/employees/EmployeeQrPreview"
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

const TODAY = new Date().toISOString().split("T")[0]

export default function EmployeeForm({
  defaultValues,
  photoUrl,
}: {
  defaultValues?: Employee
  photoUrl?: string | null
}) {
  const router = useRouter()
  const isEdit = !!defaultValues?.id

  const [livePhotoUrl, setLivePhotoUrl] = useState<string | null>(photoUrl ?? null)

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
          bloodGroup: (defaultValues.bloodGroup as EmployeeInput["bloodGroup"]) ?? "",
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
          bloodGroup: "",
          officeAddress: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelation: "",
          photoKey: null,
        },
  })
  const { isSubmitting } = form.formState
  const w = form.watch()
  const publicId = defaultValues?.publicId
  const publicUrl = publicId ? `${SITE_URL.replace(/\/$/, "")}/employee/${publicId}` : null

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-[1500px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
          <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/employees" widthClassName="w-full max-w-none">
            <FormSection title="Identity & Role" icon={User} card>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <FormField control={form.control} name="photoKey" render={({ field }) => (
                  <FormItem className="shrink-0 self-center sm:self-start">
                    <FormControl>
                      <EmployeePhotoUpload
                        value={field.value}
                        onChange={field.onChange}
                        onUploaded={setLivePhotoUrl}
                        initialUrl={photoUrl}
                        variant="avatar"
                        label="Photo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormGrid cols={4} className="flex-1">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="employeeCode" render={({ field }) => (
                    <FormItem><FormLabel>Employee Code</FormLabel><FormControl><Input placeholder="QTO-001" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="designation" render={({ field }) => (
                    <FormItem><FormLabel>Designation</FormLabel><FormControl><Input placeholder="Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
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
              </div>
            </FormSection>

            <FormSection title="Department" subtitle="Where this employee sits in the org" icon={Building2} card>
              <FormGrid cols={3}>
                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="Engineering" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="team" render={({ field }) => (
                  <FormItem><FormLabel>Team</FormLabel><FormControl><Input placeholder="Platform" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="joiningDate" render={({ field }) => (
                  <FormItem><FormLabel>Joining Date</FormLabel><FormControl><Input {...field} value={(field.value as unknown as string) ?? ""} type="date" max={TODAY} /></FormControl><FormMessage /></FormItem>
                )} />
              </FormGrid>
            </FormSection>

            <FormSection title="Contact" icon={Phone} card>
              <FormGrid cols={3}>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" inputMode="email" placeholder="jane@qtodev.com" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} inputMode="tel" placeholder="+92 3xx xxxxxxx" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormGridSpan cols={3}>
                  <FormField control={form.control} name="officeAddress" render={({ field }) => (
                    <FormItem><FormLabel>Office Address</FormLabel><FormControl><Textarea {...field} rows={3} placeholder="Building, street, city" /></FormControl><FormMessage /></FormItem>
                  )} />
                </FormGridSpan>
              </FormGrid>
            </FormSection>

            <FormSection title="Identity Document" subtitle="CNIC as printed on the card" icon={IdCard} card>
              <FormGrid cols={4}>
                <FormField control={form.control} name="cnic" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNIC</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="numeric"
                        placeholder="12345-1234567-1"
                        className="font-mono"
                        onChange={(e) => field.onChange(formatCnic(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue placeholder="—" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {BLOOD_GROUPS.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dob" render={({ field }) => (
                  <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input {...field} value={(field.value as unknown as string) ?? ""} type="date" max={TODAY} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cnicIssueDate" render={({ field }) => (
                  <FormItem><FormLabel>CNIC Issued</FormLabel><FormControl><Input {...field} value={(field.value as unknown as string) ?? ""} type="date" max={TODAY} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cnicExpiryDate" render={({ field }) => (
                  <FormItem><FormLabel>CNIC Expires</FormLabel><FormControl><Input {...field} value={(field.value as unknown as string) ?? ""} type="date" /></FormControl><FormMessage /></FormItem>
                )} />
              </FormGrid>
            </FormSection>

            <FormSection title="Emergency Contact" subtitle="Who to reach in case of an emergency" icon={ShieldAlert} card>
              <FormGrid cols={3}>
                <FormField control={form.control} name="emergencyContactName" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="emergencyContactPhone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} inputMode="tel" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="emergencyContactRelation" render={({ field }) => (
                  <FormItem><FormLabel>Relation</FormLabel><FormControl><Input {...field} placeholder="Spouse, Parent…" /></FormControl><FormMessage /></FormItem>
                )} />
              </FormGrid>
            </FormSection>
          </AdminForm>

          <div className="order-first lg:order-last lg:sticky lg:top-6 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <p className="text-xs font-semibold uppercase tracking-wide">Live Preview</p>
            </div>
            <div className="flex justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-6">
              <EmployeeCard
                admin
                name={w.name || "Employee Name"}
                designation={w.designation}
                employeeCode={w.employeeCode || "—"}
                department={w.department}
                team={w.team}
                status={w.status}
                photoUrl={livePhotoUrl}
                publicUrl={publicUrl}
                phone={w.phone}
                officeAddress={w.officeAddress}
                cnic={w.cnic}
                bloodGroup={w.bloodGroup}
                joiningDate={w.joiningDate as unknown as string}
                cnicIssueDate={w.cnicIssueDate as unknown as string}
                dob={w.dob as unknown as string}
                emergencyContactName={w.emergencyContactName}
                emergencyContactPhone={w.emergencyContactPhone}
                emergencyContactRelation={w.emergencyContactRelation}
                qrNode={publicUrl ? <EmployeeQrPreview url={publicUrl} /> : undefined}
              />
            </div>
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              This is the printable ID badge and the public QR-scan page. The QR points at the
              employee’s permanent public URL and never changes once minted, so a printed card
              stays valid.
            </p>
          </div>
        </div>
      </form>
    </Form>
  )
}
