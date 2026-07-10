"use client"

import { useForm, useWatch } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { serviceSchema, type ServiceInput } from "@/lib/validators/admin/service"
import FormSection from "@/components/admin/forms/FormSection"
import FormActions from "@/components/admin/forms/FormActions"
import FormGrid from "@/components/admin/forms/FormGrid"
import IconPicker from "@/components/admin/forms/IconPicker"
import MediaGallery from "@/components/admin/forms/MediaGallery"
import SeoPreview from "@/components/admin/forms/SeoPreview"
import TagInput from "@/components/admin/forms/TagInput"
import AdminWidgetPanel from "@/components/admin/layout/AdminWidgetPanel"
import PublishWidget from "@/components/admin/widgets/PublishWidget"
import WidgetCard from "@/components/admin/widgets/WidgetCard"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText, Palette, Image as ImageIcon, Tag, Search,
} from "lucide-react"
import { createService, updateService, toggleServicePublished } from "../actions"
import type { ServiceInput } from "@/lib/validators/admin/service"
import { normalizeStoredIcon } from "@/lib/icons/iconMap"

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

const TECH_SUGGESTIONS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL",
  "Prisma", "Tailwind CSS", "GraphQL", "REST API", "Docker", "AWS",
]

interface ServiceFormProps {
  defaultValues?: ServiceInput & { id?: string }
}

export default function ServiceForm({ defaultValues }: ServiceFormProps) {
  const isEdit = !!defaultValues?.id

  const form = useForm<ServiceInput>({
    resolver: formResolver(serviceSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          slug: defaultValues.slug,
          shortDescription: defaultValues.shortDescription,
          description: defaultValues.description ?? "",
          icon: normalizeStoredIcon(defaultValues.icon ?? ""),
          features: defaultValues.features ?? [],
          technologyTags: defaultValues.technologyTags ?? [],
          imageUrl: defaultValues.imageUrl ?? "",
          imageAlt: defaultValues.imageAlt ?? "",
          order: defaultValues.order ?? 0,
          isPublished: defaultValues.isPublished ?? false,
        }
      : {
          title: "",
          slug: "",
          shortDescription: "",
          description: "",
          icon: "",
          features: [],
          technologyTags: [],
          imageUrl: "",
          imageAlt: "",
          order: 0,
          isPublished: false,
        },
  })

  const { isSubmitting } = form.formState
  const watchedTitle = useWatch({ control: form.control, name: "title" })
  const watchedDesc = useWatch({ control: form.control, name: "shortDescription" })
  const watchedSlug = useWatch({ control: form.control, name: "slug" })
  const watchedPublished = useWatch({ control: form.control, name: "isPublished" })

  async function onSubmit(data: ServiceInput) {
    try {
      if (isEdit) {
        await updateService(defaultValues.id, data)
      } else {
        await createService(data)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Main form area */}
          <div className="space-y-5">
            {/* Basic Information */}
            <FormSection title="Basic Information" icon={FileText} subtitle="Title, slug, and descriptions">
              <FormGrid>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            if (!isEdit) {
                              form.setValue("slug", slugify(e.target.value), { shouldValidate: false })
                            }
                          }}
                          placeholder="e.g. Web Development"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="web-development" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormGrid>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="Brief one-liner shown in cards and listings" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} placeholder="Detailed description for the service page" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            {/* Icon & Brand */}
            <FormSection title="Icon & Brand Identity" icon={Palette} subtitle="Choose an icon to represent this service">
              <FormGrid>
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <IconPicker value={field.value ?? ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormGrid>
            </FormSection>

            {/* Featured Media */}
            <FormSection title="Featured Media" icon={ImageIcon} subtitle="Cover image for service card and detail page">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MediaGallery value={field.value ?? ""} onChange={field.onChange} label="Cover Image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Alt Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Descriptive alt text for accessibility" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            {/* Tags & Features */}
            <FormSection title="Tags & Features" icon={Tag} subtitle="Technology tags and feature list">
              <FormField
                control={form.control}
                name="technologyTags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technology Tags</FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Add technology…"
                        suggestions={TECH_SUGGESTIONS}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (one per line)</FormLabel>
                    <FormControl>
                      <Textarea
                        value={field.value.join("\n")}
                        onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))}
                        rows={5}
                        placeholder={"Feature 1\nFeature 2\nFeature 3"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            {/* SEO Preview */}
            <FormSection title="SEO & Meta" icon={Search} subtitle="How this page appears in search results">
              <SeoPreview
                title={watchedTitle}
                description={watchedDesc}
                slug={`services/${watchedSlug}`}
              />
            </FormSection>

            <FormActions isSubmitting={isSubmitting} cancelHref="/admin/services" />
          </div>

          {/* Right widget panel */}
          <AdminWidgetPanel className="lg:sticky lg:top-20">
            {isEdit && defaultValues && (
              <PublishWidget
                id={defaultValues.id}
                isPublished={watchedPublished}
                onToggle={toggleServicePublished}
                isSaving={isSubmitting}
              />
            )}
            {!isEdit && (
              <WidgetCard title="Visibility">
                <p className="text-xs text-muted-foreground">
                  This service will be saved as a <strong className="text-foreground">Draft</strong> by default. You can publish it from the list page after saving.
                </p>
              </WidgetCard>
            )}
            <WidgetCard title="Tips">
              <ul className="space-y-2">
                {[
                  "Use a clear, benefit-focused title",
                  "Keep the short description under 160 characters",
                  "Add relevant tech tags to help with filtering",
                  "Publish only when all content is finalized",
                ].map((tip, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary shrink-0 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </WidgetCard>
          </AdminWidgetPanel>
        </div>
      </form>
    </Form>
  )
}
