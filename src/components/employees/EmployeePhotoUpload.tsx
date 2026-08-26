"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmployeePhotoUploadProps {
  /** R2 key (Employee.photoKey), not a URL — see #414 Phase 04. */
  value: string | null | undefined
  onChange: (key: string | null) => void
  /** Resolved preview URL for the current value, admin-side only. */
  initialUrl?: string | null
  label?: string
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
  initialUrl,
  label = "Photo",
}: EmployeePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)

  async function processFile(file: File) {
    setUploading(true)
    try {
      const body = new FormData()
      body.append("file", file)
      const res = await fetch("/api/admin/employees/photo", { method: "POST", body })
      const json = (await res.json()) as { details?: { key?: string; url?: string }; error?: string }
      if (!res.ok || !json.details?.key) {
        throw new Error(json.error ?? "Upload failed")
      }
      onChange(json.details.key)
      setPreviewUrl(json.details.url ?? null)
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

  function handleClear() {
    onChange(null)
    setPreviewUrl(null)
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
