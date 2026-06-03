"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { testimonialSchema, type TestimonialInput } from "@/lib/validators/admin/testimonial"
import AdminForm from "@/components/admin/AdminForm"
import MediaUpload from "@/components/admin/MediaUpload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTestimonial, updateTestimonial } from "../actions"
import type { Testimonial } from "@prisma/client"

export default function TestimonialForm({ defaultValues }: { defaultValues?: Testimonial }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<TestimonialInput>({
    resolver: formResolver(testimonialSchema),
    defaultValues: defaultValues ?? { clientName: "", clientRole: "", clientCompany: "", quote: "", mediaType: "none", mediaUrl: "", mediaAlt: "", avatarUrl: "", avatarColor: "", rating: 5, order: 0, isPublished: false },
  })
  const { isSubmitting, watch } = form.formState
  const mediaType = form.watch("mediaType")

  async function onSubmit(data: TestimonialInput) {
    try {
      if (isEdit) await updateTestimonial(defaultValues.id, data)
      else await createTestimonial(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/testimonials">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField control={form.control} name="clientName" render={({ field }) => (
              <FormItem><FormLabel>Client name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="clientRole" render={({ field }) => (
              <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="clientCompany" render={({ field }) => (
              <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="quote" render={({ field }) => (
            <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="mediaType" render={({ field }) => (
            <FormItem><FormLabel>Media type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            <FormMessage /></FormItem>
          )} />
          {mediaType !== "none" && (
            <FormField control={form.control} name="mediaUrl" render={({ field }) => (
              <FormItem><FormControl><MediaUpload value={field.value ?? ""} onChange={field.onChange} accept={mediaType === "video" ? "video/*" : "image/*"} label="Media" /></FormControl><FormMessage /></FormItem>
            )} />
          )}
          <FormField control={form.control} name="avatarUrl" render={({ field }) => (
            <FormItem><FormControl><MediaUpload value={field.value ?? ""} onChange={field.onChange} label="Avatar" /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField control={form.control} name="rating" render={({ field }) => (
              <FormItem><FormLabel>Rating (1–5)</FormLabel><FormControl><Input {...field} type="number" min={1} max={5} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="avatarColor" render={({ field }) => (
              <FormItem><FormLabel>Avatar color</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
