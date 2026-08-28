"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

/**
 * Client-side QR render for the admin live preview — always shows the current
 * target even before the row is saved and the R2 PNG is (re)generated. The
 * stored PNG stays the source of truth for print / email; this is belt-and-
 * braces so HR never sees a stale code while editing (#416 Phase 4).
 */
export default function EmployeeQrPreview({ url }: { url: string | null | undefined }) {
  const [resolved, setResolved] = useState<{ url: string; dataUrl: string } | null>(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    QRCode.toDataURL(url, { width: 256, margin: 2 })
      .then((dataUrl) => {
        if (!cancelled) setResolved({ url, dataUrl })
      })
      .catch(() => {
        if (!cancelled) setResolved(null)
      })
    return () => {
      cancelled = true
    }
  }, [url])

  // Ignore a result that belongs to a previous `url` (or none at all).
  const dataUrl = resolved && resolved.url === url ? resolved.dataUrl : null

  if (!dataUrl) {
    return <div className="h-full w-full rounded bg-muted" aria-hidden />
  }
  // eslint-disable-next-line @next/next/no-img-element -- generated data URL, nothing to optimize
  return <img src={dataUrl} alt="Employee QR code preview" className="h-full w-full object-contain" />
}
