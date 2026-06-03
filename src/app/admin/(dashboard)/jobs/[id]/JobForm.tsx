"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { jobSchema, type JobInput } from "@/lib/validators/admin/job"
import AdminForm from "@/components/admin/AdminForm"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createJob, updateJob } from "../actions"
import type { Job } from "@prisma/client"

export default function JobForm({ defaultValues }: { defaultValues?: Job }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<JobInput>({
    resolver: formResolver(jobSchema),
    defaultValues: defaultValues
      ? { ...defaultValues, postedAt: defaultValues.postedAt?.toISOString().split("T")[0] ?? "", expiresAt: defaultValues.expiresAt?.toISOString().split("T")[0] ?? "" }
      : { title: "", department: "", location: "", type: "", description: "", requirements: [], niceToHave: [], salaryRange: "", applyUrl: "", order: 0, isPublished: false, postedAt: "", expiresAt: "" },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: JobInput) {
    try {
      if (isEdit) await updateJob(defaultValues.id, data)
      else await createJob(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/jobs">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="department" render={({ field }) => (
              <FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField control={form.control} name="location" render={({ field }) => (
              <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem><FormLabel>Type</FormLabel><FormControl><Input {...field} placeholder="Full-time" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="salaryRange" render={({ field }) => (
              <FormItem><FormLabel>Salary range</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormControl><RichTextEditor value={field.value ?? ""} onChange={field.onChange} label="Description" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="requirements" render={({ field }) => (
            <FormItem><FormLabel>Requirements (one per line)</FormLabel><FormControl><Textarea value={field.value.join("\n")} onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))} rows={4} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="niceToHave" render={({ field }) => (
            <FormItem><FormLabel>Nice to have (one per line)</FormLabel><FormControl><Textarea value={field.value.join("\n")} onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField control={form.control} name="applyUrl" render={({ field }) => (
              <FormItem><FormLabel>Apply URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="postedAt" render={({ field }) => (
              <FormItem><FormLabel>Posted at</FormLabel><FormControl><Input {...field} type="date" value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="expiresAt" render={({ field }) => (
              <FormItem><FormLabel>Expires at</FormLabel><FormControl><Input {...field} type="date" value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="isPublished" render={({ field }) => (
            <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="pub" /></FormControl><Label htmlFor="pub">Published</Label></div><FormMessage /></FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
