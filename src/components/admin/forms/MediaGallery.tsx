"use client"

import MediaUpload from "@/components/admin/MediaUpload"
import { cn } from "@/lib/utils"

interface MediaGalleryProps {
  value: string
  onChange: (url: string) => void
  label?: string
  className?: string
}

export default function MediaGallery({ value, onChange, label = "Featured Image", className }: MediaGalleryProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <MediaUpload value={value} onChange={onChange} label={label} />
      {value && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          </div>
        </div>
      )}
    </div>
  )
}
