"use client"

import { useState } from "react"
import { toast } from "sonner"
import { updatePageSection, createPageSection } from "../actions"
import AdminForm from "@/components/admin/AdminForm"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { PageSection } from "@prisma/client"

export default function PageSectionForm({ defaultValues }: { defaultValues?: PageSection }) {
  const isEdit = !!defaultValues?.slug
  const [slug, setSlug] = useState(defaultValues?.slug ?? "")
  const [label, setLabel] = useState(defaultValues?.label ?? "")
  const [isPublished, setIsPublished] = useState(defaultValues?.isPublished ?? true)
  const [jsonText, setJsonText] = useState(
    defaultValues?.data ? JSON.stringify(defaultValues.data, null, 2) : "{}"
  )
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validateJson(text: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(text)
      setJsonError(null)
      return parsed
    } catch {
      setJsonError("Invalid JSON — please fix before saving")
      return null
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = validateJson(jsonText)
    if (!data) return
    setIsSubmitting(true)
    try {
      if (isEdit) {
        await updatePageSection(defaultValues!.slug, data, isPublished, label || undefined)
      } else {
        await createPageSection(slug, label, data)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/pages">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="homepage.hero"
              disabled={isEdit}
              required={!isEdit}
            />
            {!isEdit && <p className="text-xs text-muted-foreground">Format: page.section-name (e.g. homepage.hero)</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="label">Label (optional)</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Homepage — Hero"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="data">Section Data (JSON)</Label>
          <Textarea
            id="data"
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value)
              validateJson(e.target.value)
            }}
            rows={20}
            className="font-mono text-xs"
            required
          />
          {jsonError && <p className="text-xs text-destructive">{jsonError}</p>}
        </div>

        <div className="flex items-center gap-3">
          <Switch id="pub" checked={isPublished} onCheckedChange={setIsPublished} />
          <Label htmlFor="pub">Published (live on public site)</Label>
        </div>
      </AdminForm>
    </form>
  )
}
