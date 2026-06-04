"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteTechnology, reorderTechnologies, toggleTechnologyPublished } from "./actions"
import { SI_ICON_MAP } from "@/components/technologies/TechIcon"
import { catalogByKey } from "@/lib/technologies/techCatalog"
import type { Technology } from "@prisma/client"

function TechIconSmall({ iconKey }: { iconKey: string }) {
  const entry = catalogByKey[iconKey]
  const Icon = entry ? SI_ICON_MAP[entry.iconKey] : undefined
  if (!Icon) return <span className="h-4 w-4 rounded bg-muted inline-block" />
  return <Icon size={16} color="currentColor" title={entry.name} />
}

const columns: AdminTableColumn<Technology>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "name", label: "Name" },
  {
    key: "iconKey",
    label: "Icon",
    render: (r) => (
      <div className="flex items-center gap-2">
        <TechIconSmall iconKey={r.iconKey} />
        <span className="text-xs text-muted-foreground font-mono">{r.iconKey || "—"}</span>
      </div>
    ),
  },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleTechnologyPublished} /> },
]

export default function TechnologiesTable({ rows }: { rows: Technology[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/technologies"
      onDelete={deleteTechnology}
      onReorder={reorderTechnologies}
      getItemName={(r) => r.name}
      emptyMessage="No technologies yet."
    />
  )
}
