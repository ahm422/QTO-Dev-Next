"use client"

import Link from "next/link"
import { ReactNode } from "react"
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
import { Pencil } from "lucide-react"
import ConfirmDelete from "@/components/admin/ConfirmDelete"

export interface AdminTableColumn<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
}

interface AdminTableProps<T extends { id: string; [key: string]: unknown }> {
  columns: AdminTableColumn<T>[]
  rows: T[]
  editBasePath: string
  onDelete: (id: string) => Promise<void>
  getItemName?: (row: T) => string
  isLoading?: boolean
  emptyMessage?: string
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

function TableActions<T extends { id: string }>({
  row,
  editBasePath,
  onDelete,
  getItemName,
}: {
  row: T
  editBasePath: string
  onDelete: (id: string) => Promise<void>
  getItemName?: (row: T) => string
}) {
  return (
    <div className="flex items-center justify-end gap-1 shrink-0">
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <Link href={`${editBasePath}/${row.id}`}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>
      <ConfirmDelete
        itemName={getItemName ? getItemName(row) : String(row.id)}
        onConfirm={() => onDelete(row.id)}
      />
    </div>
  )
}

export default function AdminTable<T extends { id: string; [key: string]: unknown }>({
  columns,
  rows,
  editBasePath,
  onDelete,
  getItemName,
  isLoading,
  emptyMessage = "No items yet.",
}: AdminTableProps<T>) {
  const mobileColumns = columns.slice(0, MOBILE_COLUMN_LIMIT)

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

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => {
          const title =
            getItemName?.(row) ??
            cellText(row, columns[0] ?? { key: "id", label: "ID" })
          return (
            <div
              key={row.id}
              className="rounded-lg border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-foreground line-clamp-2 min-w-0 flex-1">
                  {title}
                </p>
                <TableActions
                  row={row}
                  editBasePath={editBasePath}
                  onDelete={onDelete}
                  getItemName={getItemName}
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
                      <dt className="text-muted-foreground shrink-0 w-24">{col.label}</dt>
                      <dd className="text-foreground truncate min-w-0 flex-1">{text}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          )
        })}
      </div>

      <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
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
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
