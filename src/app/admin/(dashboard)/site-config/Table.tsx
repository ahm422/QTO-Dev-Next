"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import ConfirmDelete from "@/components/admin/ConfirmDelete"
import { deleteSiteConfig } from "./actions"
import type { SiteConfig } from "@prisma/client"

export default function SiteConfigTable({ rows }: { rows: SiteConfig[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No config entries yet.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
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
              <TableCell><code className="text-xs bg-muted px-1 py-0.5 rounded">{row.key}</code></TableCell>
              <TableCell className="text-muted-foreground text-sm">{row.label}</TableCell>
              <TableCell className="max-w-xs truncate text-sm">{row.value}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/admin/site-config/${encodeURIComponent(row.key)}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <ConfirmDelete
                    itemName={row.key}
                    onConfirm={() => deleteSiteConfig(row.key)}
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
