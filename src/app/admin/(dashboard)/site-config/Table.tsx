"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import ConfirmDelete from "@/components/admin/ConfirmDelete"
import { deleteSiteConfig } from "./actions"
import type { SiteConfig } from "@prisma/client"

function SiteConfigActions({ row }: { row: SiteConfig }) {
  return (
    <div className="flex items-center justify-end gap-1 shrink-0">
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <Link href={`/admin/site-config/${encodeURIComponent(row.key)}`}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>
      <ConfirmDelete itemName={row.key} onConfirm={() => deleteSiteConfig(row.key)} />
    </div>
  )
}

export default function SiteConfigTable({ rows }: { rows: SiteConfig[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No config entries yet.
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div
            key={row.key}
            className="rounded-lg border border-border bg-card p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-medium break-all">
                {row.key}
              </code>
              <SiteConfigActions row={row} />
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-2 min-w-0">
                <dt className="text-muted-foreground shrink-0 w-16">Label</dt>
                <dd className="text-foreground truncate min-w-0 flex-1">{row.label}</dd>
              </div>
              <div className="flex gap-2 min-w-0">
                <dt className="text-muted-foreground shrink-0 w-16">Value</dt>
                <dd className="text-foreground truncate min-w-0 flex-1">{row.value}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{row.key}</code>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{row.label}</TableCell>
                <TableCell className="max-w-xs truncate text-sm">{row.value}</TableCell>
                <TableCell className="text-right">
                  <SiteConfigActions row={row} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
