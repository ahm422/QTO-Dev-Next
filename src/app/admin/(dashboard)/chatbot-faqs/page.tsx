import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import ChatbotFaqsTable from "./Table"

export default async function ChatbotFaqsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.chatbotFaq.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Chatbot FAQs"
        subtitle="General questions and answers that train the chatbot's knowledge base"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Chatbot FAQs" }]}
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add FAQ", href: "/admin/chatbot-faqs/new" } : undefined}
      />
      <AdminContentContext
        publicPaths={[]}
        description="These Q&A pairs are not shown anywhere on the public website. They are read by the chatbot worker on its next knowledge-base sync (every 15 minutes) and used to answer visitor questions in the live chat widget."
        component="chatbot/worker/src/ingestion/sources/chatbotFaqs.ts"
      />
      <ChatbotFaqsTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
