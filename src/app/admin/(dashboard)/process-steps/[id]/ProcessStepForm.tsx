"use client"

import { useForm, useWatch } from "react-hook-form"
import { formResolver } from "@/lib/admin/formResolver"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { processStepSchema, type ProcessStepInput } from "@/lib/validators/admin/processStep"
import FormSection from "@/components/admin/forms/FormSection"
import FormGrid from "@/components/admin/forms/FormGrid"
import FormActions from "@/components/admin/forms/FormActions"
import IconPicker from "@/components/admin/forms/IconPicker"
import AdminWidgetPanel from "@/components/admin/layout/AdminWidgetPanel"
import PublishWidget from "@/components/admin/widgets/PublishWidget"
import WidgetCard from "@/components/admin/widgets/WidgetCard"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GitBranch, Info } from "lucide-react"
import { createProcessStep, updateProcessStep, toggleProcessStepPublished } from "../actions"
import type { ProcessStep } from "@prisma/client"
import { normalizeStoredIcon } from "@/lib/icons/iconMap"

export default function ProcessStepForm({ defaultValues }: { defaultValues?: ProcessStep }) {
  const router = useRouter()
  const isEdit = !!defaultValues?.id

  const form = useForm<ProcessStepInput>({
    resolver: formResolver(processStepSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          icon: normalizeStoredIcon(defaultValues.icon ?? ""),
        }
      : {
          context: "how-we-work",
          stepNumber: 1,
          title: "",
          description: "",
          icon: "",
          order: 0,
          isPublished: false,
        },
  })

  const { isSubmitting } = form.formState
  const watchedPublished = useWatch({ control: form.control, name: "isPublished" })

  async function onSubmit(data: ProcessStepInput) {
    try {
      if (isEdit) await updateProcessStep(defaultValues.id, data)
      else await createProcessStep(data)
      router.push("/admin/process-steps")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Main form area */}
          <div className="space-y-5">
            <FormSection title="Step Details" icon={GitBranch} subtitle="Context, step number, title and description">
              <FormGrid>
                <FormField control={form.control} name="context" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Context</FormLabel>
                    <FormControl><Input {...field} placeholder="how-we-work" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="stepNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step Number</FormLabel>
                    <FormControl><Input {...field} type="number" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </FormGrid>

              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Discovery & Planning" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} rows={4} placeholder="Describe what happens in this step…" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </FormSection>

            <FormSection title="Icon & Display" icon={Info} subtitle="Icon and sort order">
              <FormGrid>
                <FormField control={form.control} name="icon" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <IconPicker value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="order" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl><Input {...field} type="number" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </FormGrid>
            </FormSection>

            <FormActions isSubmitting={isSubmitting} cancelHref="/admin/process-steps" />
          </div>

          {/* Right widget panel */}
          <AdminWidgetPanel className="lg:sticky lg:top-20">
            {isEdit && defaultValues && (
              <PublishWidget
                id={defaultValues.id}
                isPublished={watchedPublished}
                onToggle={toggleProcessStepPublished}
                isSaving={isSubmitting}
              />
            )}
            {isEdit && defaultValues && (
              <WidgetCard title="Step Info">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Context</span>
                    <span className="text-foreground font-mono">{defaultValues.context}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Step #</span>
                    <span className="text-foreground">{defaultValues.stepNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order</span>
                    <span className="text-foreground">{defaultValues.order}</span>
                  </div>
                </div>
              </WidgetCard>
            )}
          </AdminWidgetPanel>
        </div>
      </form>
    </Form>
  )
}
