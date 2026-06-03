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

export default function AdminTable<T extends { id: string; [key: string]: unknown }>({
  columns,
  rows,
  editBasePath,
  onDelete,
  getItemName,
  isLoading,
  emptyMessage = "No items yet.",
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
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
    <div className="rounded-lg border border-border bg-card overflow-hidden">
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
                <div className="flex items-center justify-end gap-1">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
