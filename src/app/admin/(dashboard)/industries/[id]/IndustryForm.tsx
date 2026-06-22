"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { industrySchema, type IndustryInput } from "@/lib/validators/admin/industry"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createIndustry, updateIndustry } from "../actions"
import type { Industry } from "@prisma/client"

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-") }

export default function IndustryForm({ defaultValues }: { defaultValues?: Industry }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<IndustryInput>({
    resolver: formResolver(industrySchema),
    defaultValues: defaultValues ?? { name: "", slug: "", description: "", icon: "", bulletPoints: [], order: 0, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: IndustryInput) {
    try {
      if (isEdit) await updateIndustry(defaultValues.id, data)
      else await createIndustry(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/industries">
          <FormGrid cols={2}>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!isEdit) form.setValue("slug", slugify(e.target.value)) }} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormGrid cols={2}>
            <FormField control={form.control} name="icon" render={({ field }) => (
              <FormItem><FormLabel>Icon</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="bulletPoints" render={({ field }) => (
            <FormItem><FormLabel>Bullet points (one per line)</FormLabel><FormControl><Textarea value={field.value.join("\n")} onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))} rows={4} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="isPublished" render={({ field }) => (
            <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="pub" /></FormControl><Label htmlFor="pub">Published</Label></div><FormMessage /></FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
