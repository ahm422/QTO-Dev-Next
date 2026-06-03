import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import WhyChooseUsTable from "./Table"

export default async function WhyChooseUsPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.whyChooseUs.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-semibold">Why Choose Us</h2><p className="text-sm text-muted-foreground">{rows.length} total</p></div>
        <Button asChild size="sm"><Link href="/admin/why-choose-us/new"><Plus className="h-4 w-4 mr-1" />Add item</Link></Button>
      </div>
      <WhyChooseUsTable rows={rows} />
    </div>
  )
}
