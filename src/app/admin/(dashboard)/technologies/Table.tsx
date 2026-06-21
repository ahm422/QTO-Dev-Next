"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteTechnology, reorderTechnologies, toggleTechnologyPublished } from "./actions"
import { resolveSimpleIcon } from "@/components/technologies/TechIcon"
import type { Technology } from "@prisma/client"
import { Cpu } from "lucide-react"

function TechIconSmall({ iconKey }: { iconKey: string }) {
  const Icon = resolveSimpleIcon(iconKey)
  if (!Icon) return <span className="h-4 w-4 rounded bg-muted inline-block" />
  return <Icon size={16} color="currentColor" title={iconKey} />
}

const columns: AdminTableColumn<Technology>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  {
    key: "name",
    label: "Technology",
    render: (r) => (
      <div className="flex items-center gap-2.5">
        <TechIconSmall iconKey={r.iconKey} />
        <div>
          <p className="text-sm font-medium text-foreground">{r.name}</p>
          {r.iconKey && <p className="text-xs text-muted-foreground font-mono mt-0.5">{r.iconKey}</p>}
        </div>
      </div>
    ),
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function TechnologiesTable({ rows, canDelete, canCreate }: { rows: Technology[] ; canDelete?: boolean; canCreate?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/technologies"
      onDelete={deleteTechnology}
      onReorder={reorderTechnologies}
      getItemName={(r) => r.name}
      emptyMessage="No technologies yet."
      emptyIcon={Cpu}
      emptyAction={canCreate !== false ? { label: "+ Add Technology", href: "/admin/technologies/new" } : undefined}
      canDelete={canDelete}
    />
  )
}
