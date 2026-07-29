"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validators/admin/teamMember"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import MediaUpload from "@/components/admin/MediaUpload"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
    defaultValues: defaultValues ?? { name: "", role: "", bio: "", avatarUrl: "", linkedIn: "", order: 0, isPublished: false, isFounder: false },
  })
  const { isSubmitting } = form.formState
  const isFounder = form.watch("isFounder")

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
            <FormItem>
              <FormControl>
                <MediaUpload value={field.value ?? ""} onChange={field.onChange} label="Avatar" />
              </FormControl>
              <FormDescription>
                {isFounder
                  ? "Required for the About / homepage CEO portrait. Use a public R2 URL that returns HTTP 200."
                  : "Portrait shown in the Team Members grid when published."}
              </FormDescription>
              <FormMessage />
            </FormItem>
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
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="pub" /></FormControl>
                <Label htmlFor="pub">Published</Label>
              </div>
              <FormDescription>
                Founders must be published to appear as the CMS CEO on About and the homepage. Otherwise the site uses the static CEO fallback.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="isFounder" render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="founder" /></FormControl>
                <Label htmlFor="founder">Feature as Founder on About page</Label>
              </div>
              <FormDescription>
                Exactly one founder is allowed. Combined with Published + Avatar, this drives the CEO section; without a published founder the site still shows static fallback content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
