"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { blogPostSchema, type BlogPostInput } from "@/lib/validators/admin/blogPost"
import AdminForm from "@/components/admin/AdminForm"
import MediaUpload from "@/components/admin/MediaUpload"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createBlogPost, updateBlogPost } from "../actions"
import type { BlogPost } from "@prisma/client"

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-") }

export default function BlogPostForm({ defaultValues }: { defaultValues?: BlogPost }) {
  const isEdit = !!defaultValues?.id
  const form = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: defaultValues ?? { title: "", slug: "", excerpt: "", content: "", category: "", tags: [], author: "QTO DEV Team", imageUrl: "", imageAlt: "", readTime: undefined, isFeatured: false, isHeadline: false, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: BlogPostInput) {
    try {
      if (isEdit) await updateBlogPost(defaultValues.id, data)
      else await createBlogPost(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/blog">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!isEdit) form.setValue("slug", slugify(e.target.value)) }} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="excerpt" render={({ field }) => (
            <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem>
              <FormControl>
                <RichTextEditor value={field.value ?? ""} onChange={field.onChange} label="Content" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="author" render={({ field }) => (
              <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="readTime" render={({ field }) => (
              <FormItem><FormLabel>Read time</FormLabel><FormControl><Input {...field} placeholder="5 min read" /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="tags" render={({ field }) => (
            <FormItem><FormLabel>Tags (one per line)</FormLabel><FormControl><Textarea value={field.value.join("\n")} onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem><FormControl><MediaUpload value={field.value ?? ""} onChange={field.onChange} label="Cover image" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageAlt" render={({ field }) => (
            <FormItem><FormLabel>Image alt</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="flex gap-6 flex-wrap">
            <FormField control={form.control} name="isFeatured" render={({ field }) => (
              <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="featured" /></FormControl><Label htmlFor="featured">Featured</Label></div><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="isHeadline" render={({ field }) => (
              <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="headline" /></FormControl><Label htmlFor="headline">Headline</Label></div><FormMessage /></FormItem>
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
