import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ChatbotFaqForm from "./ChatbotFaqForm"

export default async function ChatbotFaqFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Chatbot FAQ" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Chatbot FAQs", href: "/admin/chatbot-faqs" }, { label: "New" }]} />
        <ChatbotFaqForm />
      </div>
    )
  }

  const record = await prisma.chatbotFaq.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Chatbot FAQ" subtitle={record.question} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Chatbot FAQs", href: "/admin/chatbot-faqs" }, { label: "Edit" }]} />
      <ChatbotFaqForm defaultValues={record} />
    </div>
  )
}
