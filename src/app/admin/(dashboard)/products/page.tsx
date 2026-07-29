import { getServerSession } from "@/lib/auth/session"
import {
  roleCanCreateContent,
  roleCanDeleteContent,
  type AdminRole,
} from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  fromPrismaProduct,
  productWithFeaturesInclude,
} from "@/lib/prisma/productData"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import StatCard from "@/components/admin/data/StatCard"
import StatCardGrid from "@/components/admin/data/StatCardGrid"
import FilterBar from "@/components/admin/data/FilterBar"
import ProductsTable from "./Table"
import { Package } from "lucide-react"
import { Suspense } from "react"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? ""))
    redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""

  const { q, status } = await searchParams

  const where = {
    ...(q ? { title: { contains: q } } : {}),
    ...(status === "published"
      ? { isPublished: true }
      : status === "draft"
        ? { isPublished: false }
        : {}),
  }

  const [rows, total, published, drafts] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { order: "asc" },
      include: productWithFeaturesInclude,
    }),
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.product.count({ where: { isPublished: false } }),
  ])

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        subtitle="Manage product sections on the Products page"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products" },
        ]}
        publicHref="/products"
        primaryAction={
          roleCanCreateContent(role as AdminRole)
            ? { label: "+ Add Product", href: "/admin/products/new" }
            : undefined
        }
      />

      <AdminContentContext
        publicPaths={[{ label: "Products page", href: "/products" }]}
        description="Published products appear on /products in order. Change order or publish status here to update the public page."
        component="ProductSection in src/app/(qtodev)/products/sections/"
      />

      <StatCardGrid cols={4}>
        <StatCard
          label="Total Products"
          value={total}
          icon={Package}
          iconColor="primary"
        />
        <StatCard
          label="Published"
          value={published}
          icon={Package}
          iconColor="success"
          badge="Live"
          badgeVariant="success"
          progress={(published / Math.max(1, total)) * 100}
        />
        <StatCard
          label="Drafts"
          value={drafts}
          icon={Package}
          iconColor="warning"
          badge="Hidden"
          badgeVariant="warning"
        />
        <StatCard
          label="Publish Rate"
          value={`${Math.round((published / Math.max(1, total)) * 100)}%`}
          iconColor="blue"
          progress={(published / Math.max(1, total)) * 100}
        />
      </StatCardGrid>

      <Suspense>
        <FilterBar
          searchPlaceholder="Search products…"
          filters={[
            {
              key: "status",
              placeholder: "All Statuses",
              options: [
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
              ],
            },
          ]}
        />
      </Suspense>

      <ProductsTable
        rows={rows.map(fromPrismaProduct)}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
