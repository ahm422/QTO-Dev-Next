"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { processStepSchema, type ProcessStepInput } from "@/lib/validators/admin/processStep"
import AdminForm from "@/components/admin/AdminForm"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createProcessStep, updateProcessStep } from "../actions"
import type { ProcessStep } from "@prisma/client"

export default function ProcessStepForm({ defaultValues }: { defaultValues?: ProcessStep }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<ProcessStepInput>({
    resolver: formResolver(processStepSchema),
    defaultValues: defaultValues ?? { context: "how-we-work", stepNumber: 1, title: "", description: "", icon: "", order: 0, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: ProcessStepInput) {
    try {
      if (isEdit) await updateProcessStep(defaultValues.id, data)
      else await createProcessStep(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/process-steps">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="context" render={({ field }) => (
              <FormItem><FormLabel>Context</FormLabel><FormControl><Input {...field} placeholder="how-we-work" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="stepNumber" render={({ field }) => (
              <FormItem><FormLabel>Step number</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="icon" render={({ field }) => (
              <FormItem><FormLabel>Icon key</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
