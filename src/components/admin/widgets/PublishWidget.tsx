"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import WidgetCard from "@/components/admin/widgets/WidgetCard"
import { cn } from "@/lib/utils"
import { Globe, EyeOff, Loader2, CheckCircle2 } from "lucide-react"

interface PublishWidgetProps {
  id: string
  isPublished: boolean
  onToggle: (id: string, value: boolean) => Promise<void>
  onSave?: () => void
  isSaving?: boolean
  lastSaved?: string
  className?: string
}

export default function PublishWidget({
  id,
  isPublished,
  onToggle,
  onSave,
  isSaving,
  lastSaved,
  className,
}: PublishWidgetProps) {
  const [optimistic, setOptimistic] = useState(isPublished)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (checked: boolean) => {
    setOptimistic(checked)
    startTransition(async () => {
      await onToggle(id, checked)
    })
  }

  return (
    <WidgetCard title="Publish" className={className}>
      <div className="space-y-4">
        {/* Status pill */}
        <div className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2",
          optimistic ? "bg-[var(--admin-success)]/10" : "bg-muted"
        )}>
          {optimistic
            ? <Globe className="h-4 w-4 text-[var(--admin-success)] shrink-0" />
            : <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className={cn("text-xs font-semibold", optimistic ? "text-[var(--admin-success)]" : "text-muted-foreground")}>
              {optimistic ? "Published" : "Draft"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {optimistic ? "Visible to the public" : "Not visible to visitors"}
            </p>
          </div>
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />}
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor={`publish-toggle-${id}`} className="text-sm text-foreground cursor-pointer">
            {optimistic ? "Unpublish" : "Publish"}
          </Label>
          <Switch
            id={`publish-toggle-${id}`}
            checked={optimistic}
            onCheckedChange={handleToggle}
            disabled={isPending}
          />
        </div>

        {/* Save button */}
        {onSave && (
          <Button
            type="submit"
            size="sm"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            disabled={isSaving}
            onClick={onSave}
          >
            {isSaving ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
            ) : (
              <><CheckCircle2 className="h-3.5 w-3.5" /> Save changes</>
            )}
          </Button>
        )}

        {lastSaved && (
          <p className="text-[10px] text-muted-foreground text-center">Last saved {lastSaved}</p>
        )}
      </div>
    </WidgetCard>
  )
}
