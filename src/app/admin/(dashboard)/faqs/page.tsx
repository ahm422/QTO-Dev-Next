import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import FaqsTable from "./Table"

export default async function FaqsPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.faq.findMany({ orderBy: [{ context: "asc" }, { order: "asc" }] })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold">FAQs</h2><p className="text-sm text-muted-foreground">{rows.length} total</p></div>
        <Button asChild size="sm"><Link href="/admin/faqs/new"><Plus className="h-4 w-4 mr-1" />Add FAQ</Link></Button>
      </div>
      <FaqsTable rows={rows} />
    </div>
  )
}
