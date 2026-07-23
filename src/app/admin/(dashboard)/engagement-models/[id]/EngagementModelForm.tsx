"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { engagementModelSchema, type EngagementModelInput } from "@/lib/validators/admin/engagementModel"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import LineListTextarea from "@/components/admin/forms/LineListTextarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createEngagementModel, updateEngagementModel } from "../actions"
import type { EngagementModelInput } from "@/lib/validators/admin/engagementModel"

export default function EngagementModelForm({ defaultValues }: { defaultValues?: EngagementModelInput & { id?: string } }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<EngagementModelInput>({
    resolver: formResolver(engagementModelSchema),
    defaultValues: defaultValues ?? { number: 1, title: "", description: "", features: [], isMostPopular: false, ctaLabel: "Get Started", ctaLink: "/contact", order: 0, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: EngagementModelInput) {
    try {
      if (isEdit) await updateEngagementModel(defaultValues.id, data)
      else await createEngagementModel(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/engagement-models">
          <FormGrid cols={2}>
            <FormField control={form.control} name="number" render={({ field }) => (
              <FormItem><FormLabel>Number</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="features" render={({ field }) => (
            <FormItem><FormLabel>Features (one per line)</FormLabel><FormControl><LineListTextarea value={field.value} onChange={field.onChange} rows={4} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormGrid cols={2}>
            <FormField control={form.control} name="ctaLabel" render={({ field }) => (
              <FormItem><FormLabel>CTA label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="ctaLink" render={({ field }) => (
              <FormItem><FormLabel>CTA link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <div className="flex gap-6">
            <FormField control={form.control} name="isMostPopular" render={({ field }) => (
              <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="popular" /></FormControl><Label htmlFor="popular">Most popular</Label></div><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="isPublished" render={({ field }) => (
              <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="pub" /></FormControl><Label htmlFor="pub">Published</Label></div><FormMessage /></FormItem>
            )} />
          </div>
        </AdminForm>
      </form>
    </Form>
  )
}
