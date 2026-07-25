import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  fromPrismaProduct,
  productWithFeaturesInclude,
} from "@/lib/prisma/productData"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ProductForm from "./ProductForm"

export default async function ProductFormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? ""))
    redirect("/admin/unauthorized")

  const { id } = await params
  const isNew = id === "new"

  if (!isNew) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: productWithFeaturesInclude,
    })
    if (!product) notFound()

    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit Product"
          subtitle={product.title}
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Products", href: "/admin/products" },
            { label: "Edit" },
          ]}
          badges={[
            {
              label: product.isPublished ? "Published" : "Draft",
              variant: product.isPublished ? "success" : "warning",
            },
          ]}
        />
        <ProductForm defaultValues={fromPrismaProduct(product)} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Product"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "New" },
        ]}
      />
      <ProductForm />
    </div>
  )
}
