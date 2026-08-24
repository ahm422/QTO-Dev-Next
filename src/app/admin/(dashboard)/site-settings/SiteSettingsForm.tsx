"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import {
  siteSettingsSchema,
  type SiteSettingsInput,
} from "@/lib/validators/admin/siteSettings"
import FormSection from "@/components/admin/forms/FormSection"
import FormGrid from "@/components/admin/forms/FormGrid"
import FormActions from "@/components/admin/forms/FormActions"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Globe, Mail, Share2 } from "lucide-react"
import { saveSiteSettings } from "./actions"

export default function SiteSettingsForm({ defaultValues }: { defaultValues: SiteSettingsInput }) {
  const form = useForm<SiteSettingsInput>({
    resolver: formResolver(siteSettingsSchema),
    defaultValues,
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: SiteSettingsInput) {
    try {
      await saveSiteSettings(data)
      toast.success("Site settings saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormSection
          title="Branding"
          icon={Globe}
          subtitle="Public site name, description, URL, and default OG image"
        >
          <FormGrid cols={2}>
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="QTO Dev" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="siteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGrid>
          <FormField
            control={form.control}
            name="siteDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Short site description" minHeightClassName="min-h-20" />
                </FormControl>
                <FormDescription>
                  If this is ever wired into an SEO/OG &lt;meta&gt; tag, run it through `stripHtml()` first — meta tags can&apos;t hold markup.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="siteOgImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG image</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/og/default.png" />
                </FormControl>
                <FormDescription>Absolute URL used as the default Open Graph image</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Contact"
          icon={Mail}
          subtitle="Shown in the public footer"
        >
          <FormGrid cols={2}>
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="hello@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="+1 …" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGrid>
          <FormField
            control={form.control}
            name="contactOffice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office address</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} placeholder="Street, city, country" className="resize-y" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Social links"
          icon={Share2}
          subtitle="Leave a field blank to hide that network’s icon from the footer"
        >
          <FormGrid cols={3}>
            <FormField
              control={form.control}
              name="socialFacebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://facebook.com/…" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialInstagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://instagram.com/…" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialLinkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://linkedin.com/…" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialTwitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter / X</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://x.com/…" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialGithub"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://github.com/…" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGrid>
        </FormSection>

        <FormActions
          isSubmitting={isSubmitting}
          cancelHref="/admin"
          submitLabel="Save settings"
          className="border-t border-border pt-4"
        />
      </form>
    </Form>
  )
}
