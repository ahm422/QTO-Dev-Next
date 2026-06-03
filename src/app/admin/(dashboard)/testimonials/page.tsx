import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TestimonialsTable from "./Table"

export default async function TestimonialsPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-semibold">Testimonials</h2><p className="text-sm text-muted-foreground">{rows.length} total</p></div>
        <Button asChild size="sm"><Link href="/admin/testimonials/new"><Plus className="h-4 w-4 mr-1" />Add testimonial</Link></Button>
      </div>
      <TestimonialsTable rows={rows} />
    </div>
  )
}
