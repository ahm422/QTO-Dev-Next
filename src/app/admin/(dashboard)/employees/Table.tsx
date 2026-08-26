"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { Users } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import ConfirmDelete from "@/components/admin/ConfirmDelete"
import StatusBadge from "@/components/admin/data/StatusBadge"
import EmptyState from "@/components/admin/data/EmptyState"
import { deleteEmployee } from "./actions"
import type { Employee } from "@prisma/client"

function statusVariant(status: string): "active" | "draft" | "archived" {
  if (status === "active") return "active"
  if (status === "terminated") return "archived"
  return "draft"
}

export default function EmployeesTable({
  rows,
  canDelete,
  canCreate,
}: {
  rows: Employee[]
  canDelete?: boolean
  canCreate?: boolean
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <EmptyState
          message="No employees yet."
          icon={Users}
          action={canCreate !== false ? { label: "+ Add Employee", href: "/admin/employees/new" } : undefined}
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-card overflow-hidden">
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
        <Table className="w-full min-w-[720px]">
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:nth-child(even)]:bg-muted/15">
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="text-sm font-medium text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.designation || "—"}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.employeeCode}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.department || "—"}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={statusVariant(row.status)}
                    publishedLabel="Active"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/admin/employees/${row.id}`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    {canDelete && (
                      <ConfirmDelete itemName={row.name} onConfirm={() => deleteEmployee(row.id)} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 p-2 md:hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground line-clamp-2">{row.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{row.employeeCode}</p>
              </div>
              <StatusBadge status={statusVariant(row.status)} publishedLabel="Active" />
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Department</span>
                <span className="text-foreground font-medium text-right min-w-0">{row.department || "—"}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href={`/admin/employees/${row.id}`}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
              {canDelete && (
                <ConfirmDelete itemName={row.name} onConfirm={() => deleteEmployee(row.id)} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
