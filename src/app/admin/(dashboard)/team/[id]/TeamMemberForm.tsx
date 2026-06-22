"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validators/admin/teamMember"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import MediaUpload from "@/components/admin/MediaUpload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createTeamMember, updateTeamMember } from "../actions"
import type { TeamMember } from "@prisma/client"

export default function TeamMemberForm({ defaultValues }: { defaultValues?: TeamMember }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<TeamMemberInput>({
    resolver: formResolver(teamMemberSchema),
    defaultValues: defaultValues ?? { name: "", role: "", bio: "", avatarUrl: "", linkedIn: "", order: 0, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: TeamMemberInput) {
    try {
      if (isEdit) await updateTeamMember(defaultValues.id, data)
      else await createTeamMember(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/team">
          <FormGrid cols={2}>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="bio" render={({ field }) => (
            <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="avatarUrl" render={({ field }) => (
            <FormItem><FormControl><MediaUpload value={field.value ?? ""} onChange={field.onChange} label="Avatar" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormGrid cols={2}>
            <FormField control={form.control} name="linkedIn" render={({ field }) => (
              <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="isPublished" render={({ field }) => (
            <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="pub" /></FormControl><Label htmlFor="pub">Published</Label></div><FormMessage /></FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
