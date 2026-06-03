"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { featuredWorkSchema, type FeaturedWorkInput } from "@/lib/validators/admin/featuredWork"
import AdminForm from "@/components/admin/AdminForm"
import MediaUpload from "@/components/admin/MediaUpload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createFeaturedWork, updateFeaturedWork } from "../actions"
import type { FeaturedWork } from "@prisma/client"

export default function FeaturedWorkForm({ defaultValues }: { defaultValues?: FeaturedWork }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<FeaturedWorkInput>({
    resolver: formResolver(featuredWorkSchema),
    defaultValues: defaultValues ?? { title: "", description: "", imageUrl: "", imageAlt: "", tags: [], link: "", order: 0, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: FeaturedWorkInput) {
    try {
      if (isEdit) await updateFeaturedWork(defaultValues.id, data)
      else await createFeaturedWork(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/featured-work">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem><FormControl><MediaUpload value={field.value ?? ""} onChange={field.onChange} label="Image" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageAlt" render={({ field }) => (
            <FormItem><FormLabel>Image alt</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="tags" render={({ field }) => (
            <FormItem><FormLabel>Tags (one per line)</FormLabel><FormControl><Textarea value={field.value.join("\n")} onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="link" render={({ field }) => (
              <FormItem><FormLabel>Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="isPublished" render={({ field }) => (
            <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="pub" /></FormControl><Label htmlFor="pub">Published</Label></div><FormMessage /></FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
