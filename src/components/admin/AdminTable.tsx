"use client"

import Link from "next/link"
import { ReactNode, useEffect, useState, useTransition } from "react"
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
import { GripVertical, Pencil } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ConfirmDelete from "@/components/admin/ConfirmDelete"

export interface AdminTableColumn<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
}

type OrderableRow = { id: string; order: number; [key: string]: unknown }

interface AdminTableProps<T extends OrderableRow> {
  columns: AdminTableColumn<T>[]
  rows: T[]
  editBasePath: string
  onDelete: (id: string) => Promise<void>
  getItemName?: (row: T) => string
  isLoading?: boolean
  emptyMessage?: string
  onReorder?: (items: { id: string; order: number }[]) => Promise<void>
  canDelete?: boolean
}

const MOBILE_COLUMN_LIMIT = 4

function cellText<T>(row: T, col: AdminTableColumn<T>): string {
  if (col.render) {
    const rendered = col.render(row)
    if (typeof rendered === "string" || typeof rendered === "number") {
      return String(rendered)
    }
    return "—"
  }
  const value = row[col.key as keyof T]
  if (value == null || value === "") return "—"
  return String(value)
}

function DragHandle({ listeners, attributes }: { listeners: unknown; attributes: unknown }) {
  return (
    <button
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(attributes as any)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(listeners as any)}
      className="cursor-grab touch-none text-muted-foreground hover:text-foreground p-1 shrink-0"
      aria-label="Drag to reorder"
      type="button"
      suppressHydrationWarning
    >
      <GripVertical className="h-4 w-4" />
    </button>
  )
}

function TableActions<T extends { id: string }>({
  row,
  editBasePath,
  onDelete,
  getItemName,
  canDelete = true,
}: {
  row: T
  editBasePath: string
  onDelete: (id: string) => Promise<void>
  getItemName?: (row: T) => string
  canDelete?: boolean
}) {
  return (
    <div className="flex items-center justify-end gap-1 shrink-0">
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <Link href={`${editBasePath}/${row.id}`}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>
      {canDelete && (
        <ConfirmDelete
          itemName={getItemName ? getItemName(row) : String(row.id)}
          onConfirm={() => onDelete(row.id)}
        />
      )}
    </div>
  )
}

function SortableTableRow<T extends OrderableRow>({
  row,
  columns,
  editBasePath,
  onDelete,
  getItemName,
  showDrag,
  canDelete,
}: {
  row: T
  columns: AdminTableColumn<T>[]
  editBasePath: string
  onDelete: (id: string) => Promise<void>
  getItemName?: (row: T) => string
  showDrag: boolean
  canDelete?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      {showDrag && (
        <TableCell className="w-10">
          <DragHandle listeners={listeners} attributes={attributes} />
        </TableCell>
      )}
      {columns.map((col) => (
        <TableCell key={col.key}>
          {col.render ? col.render(row) : String(row[col.key] ?? "")}
        </TableCell>
      ))}
      <TableCell className="text-right">
        <TableActions
          row={row}
          editBasePath={editBasePath}
          onDelete={onDelete}
          getItemName={getItemName}
          canDelete={canDelete}
        />
      </TableCell>
    </TableRow>
  )
}

function SortableMobileCard<T extends OrderableRow>({
  row,
  columns,
  mobileColumns,
  editBasePath,
  onDelete,
  getItemName,
  showDrag,
  canDelete,
}: {
  row: T
  columns: AdminTableColumn<T>[]
  mobileColumns: AdminTableColumn<T>[]
  editBasePath: string
  onDelete: (id: string) => Promise<void>
  getItemName?: (row: T) => string
  showDrag: boolean
  canDelete?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const title =
    getItemName?.(row) ?? cellText(row, columns[0] ?? { key: "id", label: "ID" })

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-border border-l-2 border-l-primary/20 bg-card p-4 space-y-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          {showDrag && <DragHandle listeners={listeners} attributes={attributes} />}
          <p className="font-medium text-foreground line-clamp-2 min-w-0 flex-1">{title}</p>
        </div>
        <TableActions
          row={row}
          editBasePath={editBasePath}
          onDelete={onDelete}
          getItemName={getItemName}
          canDelete={canDelete}
        />
      </div>
      <dl className="space-y-2 text-sm">
        {mobileColumns.map((col) => {
          const text = cellText(row, col)
          if (text === "—" && col.key === columns[0]?.key && getItemName) {
            return null
          }
          return (
            <div key={col.key} className="flex gap-2 min-w-0">
              <dt className="text-muted-foreground shrink-0 w-20 sm:w-24">{col.label}</dt>
              <dd className="text-foreground break-words min-w-0 flex-1">{text}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

export default function AdminTable<T extends OrderableRow>({
  columns,
  rows: initialRows,
  editBasePath,
  onDelete,
  getItemName,
  isLoading,
  emptyMessage = "No items yet.",
  onReorder,
  canDelete = true,
}: AdminTableProps<T>) {
  const router = useRouter()
  const [items, setItems] = useState(initialRows)
  const [, startTransition] = useTransition()
  const sensors = useSensors(useSensor(PointerSensor))
  const mobileColumns = columns.slice(0, MOBILE_COLUMN_LIMIT)
  const showDrag = Boolean(onReorder)

  useEffect(() => {
    setItems(initialRows)
  }, [initialRows])

  function handleDragEnd(event: DragEndEvent) {
    if (!onReorder) return
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
        setItems(initialRows)
      }
    })
  }

  if (isLoading) {
    return (
      <>
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <div className="hidden md:block space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  const listContent = (
    <>
      <div className="space-y-3 md:hidden">
        {items.map((row) => (
          <SortableMobileCard
            key={row.id}
            row={row}
            columns={columns}
            mobileColumns={mobileColumns}
            editBasePath={editBasePath}
            onDelete={onDelete}
            getItemName={getItemName}
            showDrag={showDrag}
            canDelete={canDelete}
          />
        ))}
      </div>

      <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {showDrag && <TableHead className="w-10" />}
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:nth-child(even)]:bg-muted/15">
            {items.map((row) => (
              <SortableTableRow
                key={row.id}
                row={row}
                columns={columns}
                editBasePath={editBasePath}
                onDelete={onDelete}
                getItemName={getItemName}
                showDrag={showDrag}
                canDelete={canDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )

  if (!onReorder) {
    return listContent
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {listContent}
      </SortableContext>
    </DndContext>
  )
}
