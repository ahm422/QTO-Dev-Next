import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import EmptyState from "@/components/admin/data/EmptyState"
import type { LucideIcon } from "lucide-react"

type OrderableRow = { id: string; order?: number }

interface DataTableProps<T extends OrderableRow> {
  columns: AdminTableColumn<T>[]
  rows: T[]
  editBasePath: string
  onDelete: (id: string) => Promise<void>
  getItemName?: (row: T) => string
  onReorder?: (items: { id: string; order: number }[]) => Promise<void>
  isLoading?: boolean
  emptyMessage?: string
  emptyIcon?: LucideIcon
  emptyAction?: { label: string; href: string }
  canDelete?: boolean
}

export default function DataTable<T extends OrderableRow>({
  columns,
  rows,
  editBasePath,
  onDelete,
  getItemName,
  onReorder,
  isLoading,
  emptyMessage = "No items yet.",
  emptyIcon,
  emptyAction,
  canDelete,
}: DataTableProps<T>) {
  if (!isLoading && rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <EmptyState message={emptyMessage} icon={emptyIcon} action={emptyAction} />
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-card overflow-hidden">
      <AdminTable
        columns={columns}
        rows={rows}
        editBasePath={editBasePath}
        onDelete={onDelete}
        getItemName={getItemName}
        onReorder={onReorder}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        canDelete={canDelete}
      />
    </div>
  )
}
