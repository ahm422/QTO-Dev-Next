"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface PublishToggleProps {
  id: string
  isPublished: boolean
  action: (id: string, value: boolean) => Promise<void>
}

export default function PublishToggle({ id, isPublished, action }: PublishToggleProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleChange(value: boolean) {
    startTransition(async () => {
      try {
        await action(id, value)
        router.refresh()
      } catch {
        toast.error("Failed to update publish status.")
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={`publish-${id}`}
        checked={isPublished}
        onCheckedChange={handleChange}
        disabled={pending}
      />
      <Label htmlFor={`publish-${id}`} className="text-xs text-muted-foreground cursor-pointer">
        {isPublished ? "Published" : "Draft"}
      </Label>
    </div>
  )
}
