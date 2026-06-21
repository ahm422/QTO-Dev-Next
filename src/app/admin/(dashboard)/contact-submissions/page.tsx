import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import { Inbox } from "lucide-react"

export default async function ContactSubmissionsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")

  const rows = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Submissions"
        subtitle="Inbound messages from the contact form"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Contact Submissions" }]}
      />
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface-muted py-20 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <a href={`mailto:${row.email}`} className="text-primary hover:underline">{row.email}</a>
                  </td>
                  <td className="px-4 py-3 text-foreground max-w-xs truncate">{row.subject}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {row.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
