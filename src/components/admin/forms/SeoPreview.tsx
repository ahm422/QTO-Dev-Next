"use client"

import { cn } from "@/lib/utils"
import { SITE_NAME, SITE_URL } from "@/lib/constants"

interface SeoPreviewProps {
  title?: string
  description?: string
  slug?: string
  className?: string
}

const MAX_TITLE = 60
const MAX_DESC = 155

function siteHost() {
  try {
    return new URL(SITE_URL).host
  } catch {
    return "qtodev.com"
  }
}

export default function SeoPreview({ title = "", description = "", slug = "", className }: SeoPreviewProps) {
  const displayUrl = `${siteHost()}${slug ? `/${slug}` : ""}`
  const titleLen = title.length
  const descLen = description.length

  return (
    <div className={cn("space-y-3", className)}>
      <div className="rounded-xl border border-border bg-[var(--admin-seo-bg)] p-4">
        <p className="text-[10px] text-muted-foreground mb-3 font-medium uppercase tracking-wide">Google Preview</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-4 w-4 rounded-sm bg-muted flex items-center justify-center">
            <span className="text-[8px] font-bold text-muted-foreground">Q</span>
          </div>
          <span className="text-xs text-muted-foreground">{displayUrl}</span>
        </div>
        <p className={cn("text-sm font-medium leading-snug", title ? "text-[var(--admin-seo-link)]" : "text-muted-foreground/40")}>
          {title || "Page title will appear here"} {titleLen > 0 && `— ${SITE_NAME}`}
        </p>
        <p className={cn("text-xs mt-1 leading-relaxed", description ? "text-[var(--admin-seo-desc)]" : "text-muted-foreground/40")}>
          {description || "Meta description will appear here. Keep it under 155 characters for best results."}
        </p>
      </div>
      <div className="flex gap-4 text-[10px] text-muted-foreground">
        <span className={cn(titleLen > MAX_TITLE ? "text-destructive" : titleLen > MAX_TITLE * 0.85 ? "text-[var(--admin-warning)]" : "")}>
          Title: {titleLen}/{MAX_TITLE}
        </span>
        <span className={cn(descLen > MAX_DESC ? "text-destructive" : descLen > MAX_DESC * 0.9 ? "text-[var(--admin-warning)]" : "")}>
          Description: {descLen}/{MAX_DESC}
        </span>
      </div>
    </div>
  )
}
