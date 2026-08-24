"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { projectSchema, type ProjectInput } from "@/lib/validators/admin/project"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import MediaUpload from "@/components/admin/MediaUpload"
import LineListTextarea from "@/components/admin/forms/LineListTextarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProject, updateProject } from "../actions"

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-") }

const NONE_SERVICE = "none"

type ServiceOption = { slug: string; title: string }

export default function ProjectForm({
  defaultValues,
  services = [],
}: {
  defaultValues?: ProjectInput & { id?: string }
  services?: ServiceOption[]
}) {
  const router = useRouter()
  const isEdit = !!defaultValues?.id
  const form = useForm<ProjectInput>({
    resolver: formResolver(projectSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          serviceSlug: defaultValues.serviceSlug ?? "",
          completedAt:
            typeof defaultValues.completedAt === "string"
              ? defaultValues.completedAt
              : "",
        }
      : { title: "", slug: "", client: "", category: "", tags: [], excerpt: "", description: "", challenge: "", solution: "", results: [], coverImageUrl: "", images: [], techStack: [], liveUrl: "", serviceSlug: "", isFeatured: false, order: 0, isPublished: false, completedAt: "" },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: ProjectInput) {
    try {
      if (isEdit && defaultValues?.id) await updateProject(defaultValues.id, data)
      else await createProject(data)
      router.push("/admin/projects")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/projects">
          <FormGrid cols={2}>
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!isEdit) form.setValue("slug", slugify(e.target.value)) }} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormGrid cols={3}>
            <FormField control={form.control} name="client" render={({ field }) => (
              <FormItem><FormLabel>Client</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="serviceSlug" render={({ field }) => (
            <FormItem>
              <FormLabel>Related Service</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === NONE_SERVICE ? "" : value)}
                value={field.value ? field.value : NONE_SERVICE}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NONE_SERVICE}>None</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.slug} value={service.slug}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="excerpt" render={({ field }) => (
            <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><RichTextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="challenge" render={({ field }) => (
            <FormItem><FormLabel>Challenge</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="solution" render={({ field }) => (
            <FormItem><FormLabel>Solution</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="results" render={({ field }) => (
            <FormItem><FormLabel>Results (one per line)</FormLabel><FormControl><LineListTextarea value={field.value} onChange={field.onChange} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="techStack" render={({ field }) => (
            <FormItem><FormLabel>Tech stack (one per line)</FormLabel><FormControl><LineListTextarea value={field.value} onChange={field.onChange} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="tags" render={({ field }) => (
            <FormItem><FormLabel>Tags (one per line)</FormLabel><FormControl><LineListTextarea value={field.value} onChange={field.onChange} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="coverImageUrl" render={({ field }) => (
            <FormItem><FormControl><MediaUpload value={field.value ?? ""} onChange={field.onChange} label="Cover image" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormGrid cols={2}>
            <FormField control={form.control} name="liveUrl" render={({ field }) => (
              <FormItem><FormLabel>Live URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="completedAt" render={({ field }) => (
              <FormItem><FormLabel>Completed at</FormLabel><FormControl><Input {...field} type="date" value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <div className="flex gap-6">
            <FormField control={form.control} name="isFeatured" render={({ field }) => (
              <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="featured" /></FormControl><Label htmlFor="featured">Featured</Label></div><FormMessage /></FormItem>
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
