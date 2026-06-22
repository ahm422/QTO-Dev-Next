"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { technologySchema, type TechnologyInput } from "@/lib/validators/admin/technology"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import TechnologyIconPicker from "@/components/admin/forms/TechnologyIconPicker"
import { createTechnology, updateTechnology } from "../actions"
import type { Technology } from "@prisma/client"

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-") }

export default function TechnologyForm({ defaultValues }: { defaultValues?: Technology }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<TechnologyInput>({
    resolver: formResolver(technologySchema),
    defaultValues: defaultValues ?? { name: "", slug: "", iconKey: "", order: 0, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: TechnologyInput) {
    try {
      if (isEdit) await updateTechnology(defaultValues.id, data)
      else await createTechnology(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/technologies">
          <FormGrid cols={2}>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!isEdit) form.setValue("slug", slugify(e.target.value)) }} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormGrid cols={2}>
            <FormField control={form.control} name="iconKey" render={({ field }) => (
              <FormItem><FormLabel>Icon</FormLabel><FormControl><TechnologyIconPicker value={field.value ?? ""} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="isPublished" render={({ field }) => (
            <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="pub" /></FormControl><Label htmlFor="pub">Published</Label></div><FormMessage /></FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
