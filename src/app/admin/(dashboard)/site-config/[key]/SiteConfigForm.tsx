"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validators/admin/siteConfig"
import FormSection from "@/components/admin/forms/FormSection"
import FormGrid from "@/components/admin/forms/FormGrid"
import FormActions from "@/components/admin/forms/FormActions"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { KeyRound } from "lucide-react"
import { upsertSiteConfig } from "../actions"
import type { SiteConfig } from "@prisma/client"

export default function SiteConfigForm({ defaultValues, keyParam }: { defaultValues?: SiteConfig; keyParam: string }) {
  const isEdit = !!defaultValues
  const form = useForm<SiteConfigInput>({
    resolver: formResolver(siteConfigSchema),
    defaultValues: defaultValues ?? {
      key: keyParam === "new" ? "" : decodeURIComponent(keyParam),
      value: "",
      label: "",
    },
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormSection
          title="Config entry"
          icon={KeyRound}
          subtitle="Raw SiteConfig row. Keys like site.name, contact.email, and social.* are also editable in Site Settings."
        >
          <FormGrid cols={2}>
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isEdit}
                      placeholder="e.g. contact.email"
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    {isEdit ? "Key cannot be changed after creation" : "Dot-separated identifier; must be unique"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Human-readable name" />
                  </FormControl>
                  <FormDescription>Shown in the admin table for easier scanning</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGrid>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={6}
                    placeholder="Config value"
                    className="resize-y min-h-[8rem] font-mono text-sm"
                  />
                </FormControl>
                <FormDescription>Stored as plain text in site_config</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormActions
          isSubmitting={isSubmitting}
          cancelHref="/admin/site-config"
          submitLabel={isEdit ? "Save changes" : "Create entry"}
          className="border-t border-border pt-4"
        />
      </form>
    </Form>
  )
}
