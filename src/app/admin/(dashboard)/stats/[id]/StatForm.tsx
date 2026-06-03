"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { statSchema, type StatInput } from "@/lib/validators/admin/stat"
import AdminForm from "@/components/admin/AdminForm"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createStat, updateStat } from "../actions"
import type { Stat } from "@prisma/client"

export default function StatForm({ defaultValues }: { defaultValues?: Stat }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<StatInput>({
    resolver: zodResolver(statSchema),
    defaultValues: defaultValues ?? { label: "", value: "", description: "", icon: "", color: "", order: 0, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: StatInput) {
    try {
      if (isEdit) await updateStat(defaultValues.id, data)
      else await createStat(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/stats">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="label" render={({ field }) => (
              <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="value" render={({ field }) => (
              <FormItem><FormLabel>Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField control={form.control} name="icon" render={({ field }) => (
              <FormItem><FormLabel>Icon</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="color" render={({ field }) => (
              <FormItem><FormLabel>Color</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
