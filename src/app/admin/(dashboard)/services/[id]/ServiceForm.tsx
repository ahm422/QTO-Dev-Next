"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { serviceSchema, type ServiceInput } from "@/lib/validators/admin/service"
import AdminForm from "@/components/admin/AdminForm"
import MediaUpload from "@/components/admin/MediaUpload"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createService, updateService } from "../actions"
import type { Service } from "@prisma/client"

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

interface ServiceFormProps {
  defaultValues?: Service
}

export default function ServiceForm({ defaultValues }: ServiceFormProps) {
  const isEdit = !!defaultValues?.id

  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          description: defaultValues.description ?? "",
          icon: defaultValues.icon ?? "",
          imageUrl: defaultValues.imageUrl ?? "",
          imageAlt: defaultValues.imageAlt ?? "",
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
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/services">
          <div className="grid gap-4 sm:grid-cols-2">
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
                    <Input {...field} placeholder="my-service" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} />
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
                <FormLabel>Full description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon key</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. code" />
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
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    rows={4}
                    placeholder="Feature 1&#10;Feature 2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technologyTags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technology tags (one per line)</FormLabel>
                <FormControl>
                  <Textarea
                    value={field.value.join("\n")}
                    onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))}
                    rows={3}
                    placeholder="React&#10;TypeScript"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MediaUpload value={field.value ?? ""} onChange={field.onChange} label="Cover image" />
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
                <FormLabel>Image alt text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="isPublished" />
                  </FormControl>
                  <Label htmlFor="isPublished">Published</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </AdminForm>
      </form>
    </Form>
  )
}
