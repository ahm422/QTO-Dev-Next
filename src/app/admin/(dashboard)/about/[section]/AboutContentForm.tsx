"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { formResolver } from "@/lib/admin/formResolver"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { aboutContentSchema, type AboutContentInput } from "@/lib/validators/admin/aboutContent"
import { parseMetadata } from "@/lib/metadata"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import MediaUpload from "@/components/admin/MediaUpload"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { upsertAboutContent } from "../actions"
import type { AboutContent } from "@prisma/client"

function toFormValues(record: AboutContent): AboutContentInput {
  const meta = parseMetadata(record.metadata)
  return {
    section: record.section,
    title: record.title ?? "",
    subtitle: record.subtitle ?? "",
    body: record.body ?? "",
    imageUrl: record.imageUrl ?? "",
    order: record.order,
    metadata: meta ? JSON.stringify(meta, null, 2) : "",
  }
}

export default function AboutContentForm({ defaultValues, sectionParam }: { defaultValues?: AboutContent; sectionParam: string }) {
  const router = useRouter()
  const sectionKey = defaultValues?.section ?? (sectionParam === "new" ? "" : sectionParam)
  const showMetadata = sectionKey === "erp-solutions" || sectionKey === "values" || !!defaultValues?.metadata

  const form = useForm<AboutContentInput>({
    resolver: formResolver(aboutContentSchema),
    defaultValues: defaultValues
      ? toFormValues(defaultValues)
      : { section: sectionKey, title: "", subtitle: "", body: "", imageUrl: "", order: 0, metadata: "" },
  })
  const { isSubmitting } = form.formState
  const [jsonError, setJsonError] = useState<string | null>(null)

  async function onSubmit(data: AboutContentInput) {
    if (showMetadata && data.metadata?.trim()) {
      try {
        JSON.parse(data.metadata)
        setJsonError(null)
      } catch {
        setJsonError("Invalid JSON — please fix before saving")
        return
      }
    }
    try {
      await upsertAboutContent(data)
      router.push("/admin/about")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/about">
          <FormGrid cols={2}>
            <FormField control={form.control} name="section" render={({ field }) => (
              <FormItem><FormLabel>Section key</FormLabel><FormControl><Input {...field} disabled={!!defaultValues} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
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
          {showMetadata && (
            <FormField control={form.control} name="metadata" render={({ field }) => (
              <FormItem>
                <FormLabel>Metadata (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={14}
                    className="font-mono text-xs"
                    placeholder='{"modules": [], "industries": []}'
                  />
                </FormControl>
                {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}
                <Label className="text-xs text-muted-foreground font-normal">
                  For erp-solutions: modules, industries, legacyModernization
                </Label>
                <FormMessage />
              </FormItem>
            )} />
          )}
        </AdminForm>
      </form>
    </Form>
  )
}
