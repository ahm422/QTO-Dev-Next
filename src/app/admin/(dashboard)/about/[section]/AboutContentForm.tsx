"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { aboutContentSchema, type AboutContentInput } from "@/lib/validators/admin/aboutContent"
import AdminForm from "@/components/admin/AdminForm"
import MediaUpload from "@/components/admin/MediaUpload"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { upsertAboutContent } from "../actions"
import type { AboutContent } from "@prisma/client"

function toFormValues(record: AboutContent): AboutContentInput {
  return {
    section: record.section,
    title: record.title ?? "",
    subtitle: record.subtitle ?? "",
    body: record.body ?? "",
    imageUrl: record.imageUrl ?? "",
    order: record.order,
  }
}

export default function AboutContentForm({ defaultValues, sectionParam }: { defaultValues?: AboutContent; sectionParam: string }) {
  const form = useForm<AboutContentInput>({
    resolver: formResolver(aboutContentSchema),
    defaultValues: defaultValues
      ? toFormValues(defaultValues)
      : { section: sectionParam === "new" ? "" : sectionParam, title: "", subtitle: "", body: "", imageUrl: "", order: 0 },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: AboutContentInput) {
    try {
      await upsertAboutContent(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/about">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="section" render={({ field }) => (
              <FormItem><FormLabel>Section key</FormLabel><FormControl><Input {...field} disabled={!!defaultValues} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="subtitle" render={({ field }) => (
            <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="body" render={({ field }) => (
            <FormItem><FormControl><RichTextEditor value={field.value ?? ""} onChange={field.onChange} label="Body" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem><FormControl><MediaUpload value={field.value ?? ""} onChange={field.onChange} label="Image" /></FormControl><FormMessage /></FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
