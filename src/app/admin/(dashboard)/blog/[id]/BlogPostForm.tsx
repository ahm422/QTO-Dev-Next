"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { formResolver } from "@/lib/admin/formResolver"
import { toast } from "sonner"
import { blogPostSchema, type BlogPostInput } from "@/lib/validators/admin/blogPost"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import MediaUpload from "@/components/admin/MediaUpload"
import RichTextEditor from "@/components/admin/RichTextEditor"
import LineListTextarea from "@/components/admin/forms/LineListTextarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BLOG_CATEGORY_PRESETS,
  BLOG_NEWS_CATEGORY,
  normalizeBlogCategory,
} from "@/config/blogCategories"
import { createBlogPost, updateBlogPost } from "../actions"

const CUSTOM_CATEGORY = "__custom__"

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
}

function isPresetCategory(value: string): boolean {
  return (BLOG_CATEGORY_PRESETS as readonly string[]).includes(value)
}

function categorySelectValue(category: string): string {
  if (!category) return ""
  return isPresetCategory(category) ? category : CUSTOM_CATEGORY
}

const emptyDefaults: BlogPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: [],
  author: "QTO DEV Team",
  imageUrl: "",
  imageAlt: "",
  readTime: undefined,
  publishedAt: undefined,
  isFeatured: false,
  isHeadline: false,
  isPublished: false,
}

function publishSuccessToast(data: BlogPostInput) {
  if (!data.isPublished) {
    toast.success("Saved as draft — won't appear on /blogs")
    return
  }
  if (data.category === BLOG_NEWS_CATEGORY) {
    toast.success(`Published — appears in News on /blogs (category "${BLOG_NEWS_CATEGORY}")`)
    return
  }
  toast.success("Published — appears on /blogs")
}

export default function BlogPostForm({ defaultValues }: { defaultValues?: BlogPostInput & { id?: string } }) {
  const isEdit = !!defaultValues?.id
  const initialCategory = defaultValues?.category ?? ""
  const [showCustomCategory, setShowCustomCategory] = useState(
    () => Boolean(initialCategory) && !isPresetCategory(initialCategory)
  )

  const form = useForm<BlogPostInput>({
    resolver: formResolver(blogPostSchema),
    defaultValues: defaultValues ?? emptyDefaults,
  })
  const { isSubmitting } = form.formState
  const isPublished = form.watch("isPublished")
  const category = form.watch("category")

  const selectValue = useMemo(() => {
    if (showCustomCategory) return CUSTOM_CATEGORY
    return categorySelectValue(category)
  }, [category, showCustomCategory])

  async function onSubmit(data: BlogPostInput) {
    const payload = {
      ...data,
      category: normalizeBlogCategory(data.category ?? ""),
    }
    try {
      if (isEdit && defaultValues?.id) await updateBlogPost(defaultValues.id, payload)
      else await createBlogPost(payload)
      publishSuccessToast(payload)
    } catch (err) {
      if (isRedirectError(err)) {
        publishSuccessToast(payload)
        throw err
      }
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/blog">
          <div
            className={`rounded-lg border px-4 py-3 flex flex-wrap items-center justify-between gap-3 ${
              isPublished
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-amber-500/40 bg-amber-500/10"
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {isPublished ? "Published" : "Draft"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isPublished
                  ? category === BLOG_NEWS_CATEGORY
                    ? `Visible on /blogs and in the News section.`
                    : "Visible on /blogs when you save."
                  : "Won't appear on /blogs until you publish."}
              </p>
            </div>
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="pub"
                      />
                    </FormControl>
                    <Label htmlFor="pub">Published</Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormGrid cols={2}>
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!isEdit) form.setValue("slug", slugify(e.target.value)) }} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
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
          <FormGrid cols={3}>
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={selectValue || undefined}
                  onValueChange={(value) => {
                    if (value === CUSTOM_CATEGORY) {
                      setShowCustomCategory(true)
                      if (isPresetCategory(field.value ?? "")) {
                        field.onChange("")
                      }
                      return
                    }
                    setShowCustomCategory(false)
                    field.onChange(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BLOG_CATEGORY_PRESETS.map((preset) => (
                      <SelectItem key={preset} value={preset}>
                        {preset === BLOG_NEWS_CATEGORY
                          ? `${preset} (shows in News on /blogs)`
                          : preset}
                      </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_CATEGORY}>Custom…</SelectItem>
                  </SelectContent>
                </Select>
                {showCustomCategory ? (
                  <FormControl>
                    <Input
                      className="mt-2"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={() => field.onChange(normalizeBlogCategory(field.value ?? ""))}
                      placeholder="Custom category"
                      autoComplete="off"
                    />
                  </FormControl>
                ) : null}
                <FormDescription>
                  Use &quot;{BLOG_NEWS_CATEGORY}&quot; for the News section on /blogs. Publish to make it public.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="author" render={({ field }) => (
              <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="readTime" render={({ field }) => (
              <FormItem>
                <FormLabel>Read time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="5"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      field.onChange(raw === "" ? undefined : Number(raw));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="tags" render={({ field }) => (
            <FormItem><FormLabel>Tags (one per line)</FormLabel><FormControl><LineListTextarea value={field.value} onChange={field.onChange} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem><FormControl><MediaUpload value={field.value ?? ""} onChange={field.onChange} label="Cover image" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageAlt" render={({ field }) => (
            <FormItem><FormLabel>Image alt</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormGrid cols={2}>
            <FormField control={form.control} name="publishedAt" render={({ field }) => (
              <FormItem>
                <FormLabel>Published date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </FormGrid>
          <div className="flex gap-6 flex-wrap">
            <FormField control={form.control} name="isFeatured" render={({ field }) => (
              <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="featured" /></FormControl><Label htmlFor="featured">Featured</Label></div><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="isHeadline" render={({ field }) => (
              <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="headline" /></FormControl><Label htmlFor="headline">Headline</Label></div><FormMessage /></FormItem>
            )} />
          </div>
        </AdminForm>
      </form>
    </Form>
  )
}
