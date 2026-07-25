"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteProduct, reorderProducts } from "./actions"
import type { ProductInput } from "@/lib/validators/admin/product"
import { Package } from "lucide-react"

type ProductTableRow = ProductInput & {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

const columns: AdminTableColumn<ProductTableRow>[] = [
  {
    key: "order",
    label: "#",
    render: (r) => (
      <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span>
    ),
  },
  {
    key: "title",
    label: "Product",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.title}</p>
        {r.shortDescription && (
          <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">
            {r.shortDescription}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "slug",
    label: "Slug",
    render: (r) => (
      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
        {r.slug}
      </code>
    ),
  },
  {
    key: "isPublished",
    label: "Status",
    render: (r) => <StatusBadge status={r.isPublished} />,
  },
  {
    key: "features",
    label: "Features",
    render: (r) => (
      <span className="text-xs text-muted-foreground tabular-nums">
        {r.features.length}
      </span>
    ),
  },
]

export default function ProductsTable({
  rows,
  canDelete,
  canCreate,
}: {
  rows: ProductTableRow[]
  canDelete?: boolean
  canCreate?: boolean
}) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/products"
      onDelete={deleteProduct}
      onReorder={reorderProducts}
      getItemName={(r) => r.title}
      emptyMessage="No products yet."
      emptyIcon={Package}
      emptyAction={
        canCreate !== false
          ? { label: "+ Add Product", href: "/admin/products/new" }
          : undefined
      }
      canDelete={canDelete}
    />
  )
}
