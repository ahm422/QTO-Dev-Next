"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Play } from "lucide-react"
import { cn } from "@/components/theme/cn"

interface MediaUploadProps {
  value: string
  onChange: (url: string) => void
  accept?: string
  label?: string
  variant?: "default" | "featured"
}

function isVideoMime(mime: string | null): boolean {
  return mime?.startsWith("video/") ?? false
}

function fileMatchesAccept(file: File, accept: string): boolean {
  if (accept === "*/*" || !accept) return true
  const parts = accept.split(",").map((p) => p.trim())
  return parts.some((part) => {
    if (part.endsWith("/*")) {
      const prefix = part.slice(0, -1)
      return file.type.startsWith(prefix)
    }
    return file.type === part || file.name.toLowerCase().endsWith(part.replace(/^\./, "."))
  })
}

function postWithProgress(
  file: File,
  onProgress: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = new FormData()
    body.append("file", file)

    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText) as { details?: { url?: string } }
          const url = json.details?.url
          if (url) resolve(url)
          else reject(new Error("No URL in upload response"))
        } catch {
          reject(new Error("Invalid upload response"))
        }
      } else {
        try {
          const json = JSON.parse(xhr.responseText) as { error?: string }
          reject(new Error(typeof json.error === "string" ? json.error : "Upload failed"))
        } catch {
          reject(new Error("Upload failed"))
        }
      }
    })
    xhr.addEventListener("error", () => reject(new Error("Upload failed")))
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")))
    xhr.open("POST", "/api/admin/upload")
    xhr.send(body)
  })
}

export default function MediaUpload({
  value,
  onChange,
  accept = "image/*",
  label = "Upload media",
  variant = "default",
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedMime, setUploadedMime] = useState<string | null>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      if (!fileMatchesAccept(file, accept)) {
        toast.error("File type not allowed for this field")
        return
      }

      setUploading(true)
      setProgress(0)
      setVideoPlaying(false)

      try {
        const url = await postWithProgress(file, setProgress)
        setUploadedMime(file.type)
        onChange(url)
      } catch (err) {
        setProgress(0)
        toast.error(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setUploading(false)
      }
    },
    [accept, onChange],
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void processFile(file)
    e.target.value = ""
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (uploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) void processFile(file)
  }

  const isVideo =
    (value && isVideoMime(uploadedMime)) ||
    (value && /\.(mp4|webm)$/i.test(value.split("?")[0] ?? ""))

  function handleClear() {
    onChange("")
    setUploadedMime(null)
    setVideoPlaying(false)
    setProgress(0)
  }

  function handleVideoPlay() {
    const el = videoRef.current
    if (!el) return
    setVideoPlaying(true)
    void el.play()
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value ? (
        variant === "featured" && !isVideo ? (
          <div className="relative rounded-xl overflow-hidden aspect-video w-full">
            <Image
              src={value}
              alt="Uploaded media"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? `Uploading… ${progress}%` : "Replace"}
            </Button>
          </div>
        ) : (
          <div className="relative inline-block">
            {isVideo ? (
              <div className="relative w-60 h-40 rounded-md border border-border overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={value}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  controls={videoPlaying}
                  onEnded={() => setVideoPlaying(false)}
                />
                {!videoPlaying && (
                  <button
                    type="button"
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      "bg-black/30 hover:bg-black/40 transition-colors",
                    )}
                    onClick={handleVideoPlay}
                    aria-label="Play video preview"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <Image
                src={value}
                alt="Uploaded media"
                width={240}
                height={160}
                className="rounded-md object-cover border border-border"
              />
            )}
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
        )
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/40 hover:bg-muted/60",
          )}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {uploading
              ? `Uploading… ${progress}%`
              : "Drop files or click to upload"}
          </p>
          {uploading && (
            <div className="mt-3 h-1.5 w-full max-w-xs rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
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

      {value && variant === "default" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? `Uploading… ${progress}%` : "Replace"}
        </Button>
      )}
    </div>
  )
}
