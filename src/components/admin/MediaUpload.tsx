"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

interface MediaUploadProps {
  value: string
  onChange: (url: string) => void
  accept?: string
  label?: string
}

export default function MediaUpload({
  value,
  onChange,
  accept = "image/*",
  label = "Upload media",
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Upload failed")
      }

      const { details } = await res.json()
      const { presignedUrl, publicUrl } = details

      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })

      if (!putRes.ok) throw new Error("Storage upload failed")

      onChange(publicUrl)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const isImage = value && !value.match(/\.(mp4|webm|ogg|mov)$/i)

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value ? (
        <div className="relative inline-block">
          {isImage ? (
            <Image
              src={value}
              alt="Uploaded media"
              width={240}
              height={160}
              className="rounded-md object-cover border border-border"
            />
          ) : (
            <video src={value} className="rounded-md border border-border w-60 h-40 object-cover" controls />
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={() => onChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 p-8 cursor-pointer hover:bg-muted/60 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {uploading ? "Uploading…" : "Click to upload"}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />

      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Replace"}
        </Button>
      )}
    </div>
  )
}
