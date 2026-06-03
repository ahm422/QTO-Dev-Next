"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AdminFormProps {
  children: ReactNode
  isSubmitting: boolean
  cancelHref?: string
}

export default function AdminForm({ children, isSubmitting, cancelHref }: AdminFormProps) {
  const router = useRouter()

  function handleCancel() {
    if (cancelHref) {
      router.push(cancelHref)
    } else {
      router.back()
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">{children}</CardContent>
      <CardFooter className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  )
}
