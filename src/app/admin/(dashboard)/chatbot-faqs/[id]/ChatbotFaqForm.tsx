"use client"

import { useForm } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { chatbotFaqSchema, type ChatbotFaqInput } from "@/lib/validators/admin/chatbotFaq"
import AdminForm from "@/components/admin/AdminForm"
import FormGrid from "@/components/admin/forms/FormGrid"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createChatbotFaq, updateChatbotFaq } from "../actions"
import type { ChatbotFaq } from "@prisma/client"

export default function ChatbotFaqForm({ defaultValues }: { defaultValues?: ChatbotFaq }) {
  const router = useRouter()
  const isEdit = !!defaultValues?.id
  const form = useForm<ChatbotFaqInput>({
    resolver: formResolver(chatbotFaqSchema),
    defaultValues: defaultValues ?? { question: "", answer: "", category: "general", order: 0, isPublished: false },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: ChatbotFaqInput) {
    try {
      if (isEdit) await updateChatbotFaq(defaultValues.id, data)
      else await createChatbotFaq(data)
      router.push("/admin/chatbot-faqs")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminForm isSubmitting={isSubmitting} cancelHref="/admin/chatbot-faqs">
          <FormGrid cols={2}>
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem>
            )} />
          </FormGrid>
          <FormField control={form.control} name="question" render={({ field }) => (
            <FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="answer" render={({ field }) => (
            <FormItem><FormLabel>Answer</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="isPublished" render={({ field }) => (
            <FormItem><div className="flex items-center gap-3"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="pub" /></FormControl><Label htmlFor="pub">Published</Label></div><FormMessage /></FormItem>
          )} />
        </AdminForm>
      </form>
    </Form>
  )
}
