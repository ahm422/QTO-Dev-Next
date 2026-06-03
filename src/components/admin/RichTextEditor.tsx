"use client"

import dynamic from "next/dynamic"
import { Label } from "@/components/ui/label"

const Editor = dynamic(() => import("react-simple-wysiwyg").then((m) => m.default), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  label?: string
}

export default function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="rounded-md border border-border overflow-hidden [&_.rsw-editor]:min-h-48 [&_.rsw-toolbar]:border-b [&_.rsw-toolbar]:border-border [&_.rsw-toolbar]:bg-muted/40">
        <Editor value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  )
}
