"use client"

import { ChevronDown, ChevronUp, CircleHelp, Plus, Trash2 } from "lucide-react"
import { useFieldArray, type Control, type FieldValues } from "react-hook-form"
import FormSection from "@/components/admin/forms/FormSection"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FaqFieldValues = FieldValues & {
  faqs: { question: string; answer: string }[]
}

export default function FaqListField<T extends FaqFieldValues>({
  control,
}: {
  control: Control<T>
}) {
  const faqControl = control as unknown as Control<FaqFieldValues>
  const { fields, append, remove, move } = useFieldArray({
    control: faqControl,
    name: "faqs",
  })

  return (
    <FormSection
      title="FAQs"
      icon={CircleHelp}
      subtitle="Questions and answers for this page only."
    >
      <div className="space-y-4">
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No FAQs yet. This section stays hidden on the public page until you add one.
          </p>
        )}
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">FAQ {index + 1}</p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Move FAQ ${index + 1} up`}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => move(index, index + 1)}
                  disabled={index === fields.length - 1}
                  aria-label={`Move FAQ ${index + 1} down`}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  aria-label={`Remove FAQ ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <FormField
              control={faqControl}
              name={`faqs.${index}.question`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input {...f} value={typeof f.value === "string" ? f.value : ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={faqControl}
              name={`faqs.${index}.answer`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      {...f}
                      rows={4}
                      value={typeof f.value === "string" ? f.value : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ question: "", answer: "" })}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add FAQ
        </Button>
      </div>
    </FormSection>
  )
}
