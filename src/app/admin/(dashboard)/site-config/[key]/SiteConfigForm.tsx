"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validators/admin/siteConfig"
import AdminForm from "@/components/admin/AdminForm"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { upsertSiteConfig } from "../actions"
import type { SiteConfig } from "@prisma/client"

export default function SiteConfigForm({ defaultValues, keyParam }: { defaultValues?: SiteConfig; keyParam: string }) {
  const form = useForm<SiteConfigInput>({
    resolver: formResolver(siteConfigSchema),
    defaultValues: defaultValues ?? { key: keyParam === "new" ? "" : decodeURIComponent(keyParam), value: "", label: "" },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: SiteConfigInput) {
    try {
      await upsertSiteConfig(data)
      toast.success("Saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/site-config">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="key" render={({ field }) => (
              <FormItem><FormLabel>Key</FormLabel><FormControl><Input {...field} disabled={!!defaultValues} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="label" render={({ field }) => (
              <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="value" render={({ field }) => (
            <FormItem><FormLabel>Value</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
