"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormActionsProps {
  isSubmitting: boolean
  cancelHref?: string
  submitLabel?: string
  className?: string
}

export default function FormActions({
  isSubmitting,
  cancelHref,
  submitLabel = "Save changes",
  className,
}: FormActionsProps) {
  const router = useRouter()

  function handleCancel() {
    if (cancelHref) router.push(cancelHref)
    else router.back()
  }

  return (
    <div className={cn("flex items-center justify-end gap-3 pt-2", className)}>
      <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting} className="border-border">
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 min-w-28">
        {isSubmitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : submitLabel}
      </Button>
    </div>
  )
}
