"use client"

import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { productSchema, type ProductInput } from "@/lib/validators/admin/product"
import FormSection from "@/components/admin/forms/FormSection"
import FormActions from "@/components/admin/forms/FormActions"
import FormGrid from "@/components/admin/forms/FormGrid"
import MediaUpload from "@/components/admin/MediaUpload"
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
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Button } from "@/components/ui/button"
import { FileText, Image as ImageIcon, Layers, Plus, Trash2 } from "lucide-react"
import {
  createProduct,
  updateProduct,
  toggleProductPublished,
} from "../actions"

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

interface ProductFormProps {
  defaultValues?: ProductInput & { id?: string }
}

export default function ProductForm({ defaultValues }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!defaultValues?.id

  const form = useForm<ProductInput>({
    resolver: formResolver(productSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          slug: defaultValues.slug,
          subtitle: defaultValues.subtitle ?? "",
          shortDescription: defaultValues.shortDescription ?? "",
          description: defaultValues.description ?? "",
          statusLabel: defaultValues.statusLabel ?? "",
          titleHighlight: defaultValues.titleHighlight ?? "",
          imageUrl: defaultValues.imageUrl ?? "",
          imageAlt: defaultValues.imageAlt ?? "",
          features: defaultValues.features ?? [],
          order: defaultValues.order ?? 0,
          isPublished: defaultValues.isPublished ?? false,
        }
      : {
          title: "",
          slug: "",
          subtitle: "",
          shortDescription: "",
          description: "",
          statusLabel: "",
          titleHighlight: "",
          imageUrl: "",
          imageAlt: "",
          features: [],
          order: 0,
          isPublished: false,
        },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  })

  const { isSubmitting } = form.formState
  const watchedPublished = useWatch({
    control: form.control,
    name: "isPublished",
  })

  async function onSubmit(data: ProductInput) {
    try {
      if (isEdit) {
        await updateProduct(defaultValues.id!, data)
      } else {
        await createProduct(data)
      }
      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
          <div className="space-y-5">
            <FormSection
              title="Basic Information"
              icon={FileText}
              subtitle="Title, slug, and product copy"
            >
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
                              form.setValue("slug", slugify(e.target.value), {
                                shouldValidate: false,
                              })
                            }
                          }}
                          placeholder="e.g. Construct Quest"
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
                        <Input {...field} placeholder="my-product" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormGrid>

              <FormGrid>
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle / eyebrow</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="CONSTRUCT QUEST" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="titleHighlight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title highlight</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Quest" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormGrid>

              <FormGrid>
                <FormField
                  control={form.control}
                  name="statusLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status label</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="In development" />
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

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short description / tagline</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder="Brief tagline shown under the title"
                      />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Full product body copy"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              title="Featured Media"
              icon={ImageIcon}
              subtitle="Optional product image"
            >
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MediaUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        label="Image"
                        variant="featured"
                      />
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
                      <Input
                        {...field}
                        placeholder="Descriptive alt text for accessibility"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              title="Features / Modules"
              icon={Layers}
              subtitle="Module cards shown on the Products page"
            >
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-lg border border-border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        Feature {index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        aria-label={`Remove feature ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`features.${index}.name`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...f} placeholder="e.g. Bid Board" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`features.${index}.description`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...f}
                              rows={2}
                              placeholder="Short module description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`features.${index}.icon`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Icon (optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              placeholder="AppIcon name, e.g. layers"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ name: "", description: "", icon: "" })
                  }
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add feature
                </Button>
              </div>
            </FormSection>

            <FormActions
              isSubmitting={isSubmitting}
              cancelHref="/admin/products"
            />
          </div>

          <AdminWidgetPanel className="lg:sticky lg:top-20">
            {isEdit && defaultValues?.id && (
              <PublishWidget
                id={defaultValues.id}
                isPublished={watchedPublished}
                onToggle={toggleProductPublished}
                isSaving={isSubmitting}
              />
            )}
            {!isEdit && (
              <WidgetCard title="Visibility">
                <p className="text-xs text-muted-foreground">
                  This product will be saved as a{" "}
                  <strong className="text-foreground">Draft</strong> by default.
                  Publish it from the edit page after saving.
                </p>
              </WidgetCard>
            )}
            <WidgetCard title="Tips">
              <ul className="space-y-2">
                {[
                  "Published products appear on /products sorted by order",
                  "Slug becomes the section anchor (e.g. #my-product)",
                  "Features become the module cards on /products",
                  "Unpublished products are omitted from /products",
                ].map((tip, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
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
