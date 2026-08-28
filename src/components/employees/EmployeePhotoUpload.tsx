"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Pencil, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmployeePhotoUploadProps {
  /** R2 key (Employee.photoKey), not a URL — see #414 Phase 04. */
  value: string | null | undefined
  onChange: (key: string | null) => void
  /** Fires with the freshly uploaded (or cleared) preview URL so a parent
   * can show it in a live badge preview before the row is saved. */
  onUploaded?: (url: string | null) => void
  /** Resolved preview URL for the current value, admin-side only. */
  initialUrl?: string | null
  label?: string
  /** "avatar" — compact circular picker for use beside other identity
   * fields. "default" — the larger drop-zone card. */
  variant?: "default" | "avatar"
}

async function uploadFile(file: File): Promise<{ key: string; url?: string }> {
  const body = new FormData()
  body.append("file", file)
  const res = await fetch("/api/admin/employees/photo", { method: "POST", body })
  const json = (await res.json()) as { details?: { key?: string; url?: string }; error?: string }
  if (!res.ok || !json.details?.key) {
    throw new Error(json.error ?? "Upload failed")
  }
  return { key: json.details.key, url: json.details.url }
}

/**
 * Trimmed sibling of MediaUpload for the one field that must store an R2
 * key rather than a public URL — the public employee card never emits a
 * raw R2 URL for this field, so the upload response carries both, and only
 * `key` is what the form persists.
 */
export default function EmployeePhotoUpload({
  value,
  onChange,
  onUploaded,
  initialUrl,
  label = "Photo",
  variant = "default",
}: EmployeePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)

  async function processFile(file: File) {
    setUploading(true)
    try {
      const { key, url } = await uploadFile(file)
      onChange(key)
      setPreviewUrl(url ?? null)
      onUploaded?.(url ?? null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void processFile(file)
    e.target.value = ""
  }

  function handleClear(e?: React.MouseEvent) {
    e?.stopPropagation()
    onChange(null)
    setPreviewUrl(null)
    onUploaded?.(null)
  }

  if (variant === "avatar") {
    const hasPhoto = Boolean(previewUrl && value)
    return (
      <div className="flex flex-col items-center gap-2">
        {label && <Label className="sr-only">{label}</Label>}
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            "group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 transition-colors",
            hasPhoto ? "border-border" : "border-dashed border-border hover:border-primary/50 bg-muted/60",
          )}
          disabled={uploading}
        >
          {hasPhoto ? (
            <Image src={previewUrl!} alt="Employee photo" width={96} height={96} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
              <Upload className="h-5 w-5" />
              <span className="text-[10px] font-medium">Upload</span>
            </span>
          )}

          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="h-5 w-5 animate-spin text-foreground" />
            </span>
          )}

          {!uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
              <Pencil className="h-4 w-4 text-white" />
            </span>
          )}
        </button>

        {hasPhoto && !uploading && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-medium text-muted-foreground hover:text-destructive"
          >
            Remove
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {previewUrl && value ? (
        <div className="relative inline-block">
          <Image
            src={previewUrl}
            alt="Employee photo"
            width={120}
            height={120}
            className="rounded-full object-cover border border-border h-[120px] w-[120px]"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors",
            "border-border bg-muted/40 hover:bg-muted/60",
          )}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
        >
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground text-center">
            {uploading ? "Uploading…" : "Click to upload (JPEG/PNG/WebP, max 5MB)"}
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />
    </div>
  )
}
