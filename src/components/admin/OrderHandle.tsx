"use client"

import { ReactNode, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { useState } from "react"

interface OrderItem {
  id: string
  order: number
}

interface OrderHandleProps<T extends OrderItem> {
  items: T[]
  onReorder: (items: { id: string; order: number }[]) => Promise<void>
  renderItem: (item: T, dragHandle: ReactNode) => ReactNode
}

function SortableItem({
  id,
  children,
}: {
  id: string
  children: (dragHandle: ReactNode) => ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handle = (
    <button
      {...attributes}
      {...listeners}
      className="cursor-grab touch-none text-muted-foreground hover:text-foreground p-1"
      aria-label="Drag to reorder"
    >
      <GripVertical className="h-4 w-4" />
    </button>
  )

  return (
    <div ref={setNodeRef} style={style}>
      {children(handle)}
    </div>
  )
}

export default function OrderHandle<T extends OrderItem>({
  items: initialItems,
  onReorder,
  renderItem,
}: OrderHandleProps<T>) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [, startTransition] = useTransition()

  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)
    setItems(reordered)

    const payload = reordered.map((item, index) => ({ id: item.id, order: index }))

    startTransition(async () => {
      try {
        await onReorder(payload)
        router.refresh()
      } catch {
        toast.error("Failed to save order.")
        setItems(initialItems)
      }
    })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            {(handle) => renderItem(item, handle)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}
