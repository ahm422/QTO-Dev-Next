"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { contactInfoSchema, type ContactInfoInput } from "@/lib/validators/admin/contactInfo"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createContactInfo, updateContactInfo } from "../actions"
import type { ContactInfo } from "@prisma/client"

export default function ContactInfoForm({ defaultValues }: { defaultValues?: ContactInfo }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<ContactInfoInput>({
    resolver: formResolver(contactInfoSchema),
    defaultValues: defaultValues ?? { type: "", label: "", value: "", subLabel: "", icon: "", order: 0, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: ContactInfoInput) {
    try {
      if (isEdit) await updateContactInfo(defaultValues.id, data)
      else await createContactInfo(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/contact-info">
          <FormGrid cols={2}>
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem><FormLabel>Type</FormLabel><FormControl><Input {...field} placeholder="email, phone, address…" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="icon" render={({ field }) => (
              <FormItem><FormLabel>Icon key</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormGrid cols={2}>
            <FormField control={form.control} name="label" render={({ field }) => (
              <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="subLabel" render={({ field }) => (
              <FormItem><FormLabel>Sub-label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="value" render={({ field }) => (
            <FormItem><FormLabel>Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="order" render={({ field }) => (
            <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="isPublished" render={({ field }) => (
            <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="pub" /></FormControl><Label htmlFor="pub">Published</Label></div><FormMessage /></FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
