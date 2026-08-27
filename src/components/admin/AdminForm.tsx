"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminFormProps {
  children: ReactNode
  isSubmitting: boolean
  cancelHref?: string
  submitLabel?: string
  /** Card width. Defaults to the narrow single-column CMS form width; pass
   * e.g. "w-full" for a form that shares its row with a sidebar (the
   * sidebar's own column then bounds the width instead). */
  widthClassName?: string
}

export default function AdminForm({ children, isSubmitting, cancelHref, submitLabel, widthClassName }: AdminFormProps) {
  const router = useRouter()

  function handleCancel() {
    if (cancelHref) {
      router.push(cancelHref)
    } else {
      router.back()
    }
  }

  return (
    <Card className={cn("w-full max-w-3xl mx-auto", widthClassName)}>
      <CardContent className="p-4 md:p-6 space-y-5">{children}</CardContent>
      <CardFooter className="px-4 md:px-6 pb-4 md:pb-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto gap-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving…" : (submitLabel ?? "Save")}
        </Button>
      </CardFooter>
    </Card>
  )
}
