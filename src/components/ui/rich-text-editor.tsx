"use client"

import * as React from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { AlertCircle, Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, LinkIcon, Code, Undo2, Redo2, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const BLOCK_STYLES = [
  { label: "Paragraph", isActive: (editor: Editor) => editor.isActive("paragraph") && !editor.isActive("heading"), run: (editor: Editor) => editor.chain().focus().setParagraph().run() },
  { label: "Heading 1", isActive: (editor: Editor) => editor.isActive("heading", { level: 1 }), run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: "Heading 2", isActive: (editor: Editor) => editor.isActive("heading", { level: 2 }), run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: "Heading 3", isActive: (editor: Editor) => editor.isActive("heading", { level: 3 }), run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run() },
]

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      data-active={active || undefined}
      onClick={onClick}
      className="data-[active]:bg-accent/15 data-[active]:text-primary"
    >
      {children}
    </Button>
  )
}

function LinkButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState("")

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setUrl(editor.getAttributes("link").href ?? "")
      }}
    >
      <PopoverTrigger asChild>
        <span>
          <ToolbarButton onClick={() => setOpen(true)} active={editor.isActive("link")} label="Link">
            <LinkIcon className="size-4" />
          </ToolbarButton>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const trimmed = url.trim()
            if (trimmed) {
              editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run()
            } else {
              editor.chain().focus().extendMarkRange("link").unsetLink().run()
            }
            setOpen(false)
          }}
        >
          <Input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="h-8"
          />
          <Button type="submit" size="sm">
            {url.trim() ? "Set" : "Remove"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const activeStyle = BLOCK_STYLES.find((s) => s.isActive(editor)) ?? BLOCK_STYLES[0]

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/30 px-1.5 py-1">
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} label="Undo">
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} label="Redo">
        <Redo2 className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="gap-1 px-2 text-xs font-normal">
            {activeStyle.label}
            <ChevronDown className="size-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {BLOCK_STYLES.map((style) => (
            <DropdownMenuItem key={style.label} onSelect={() => style.run(editor)}>
              {style.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold">
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic">
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} label="Underline">
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} label="Strikethrough">
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} label="Inline code">
        <Code className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bulleted list">
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Numbered list">
        <ListOrdered className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <LinkButton editor={editor} />
    </div>
  )
}

interface RichTextEditorProps extends Omit<React.ComponentProps<"div">, "onChange" | "children"> {
  value?: string
  onChange?: (html: string) => void
  onBlur?: () => void
  placeholder?: string
  label?: string
  error?: string
  required?: boolean
  minHeightClassName?: string
  disabled?: boolean
}

/**
 * Controlled WYSIWYG editor for CMS "description" fields — a Textarea
 * drop-in replacement. `value`/`onChange` carry sanitized-on-write* HTML
 * (see `sanitizeHtml`, applied on read before public rendering) and drop
 * into react-hook-form the same way Textarea does.
 *
 * An empty document serializes to `""`, not `"<p></p>"`, so it keeps working
 * with existing `z.string().min(1)` validation.
 */
export function RichTextEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  error,
  required,
  className,
  minHeightClassName = "min-h-32",
  disabled,
  id,
  ...rest
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none dark:prose-invert focus:outline-none px-3 py-2",
          minHeightClassName
        ),
      },
    },
    onUpdate: ({ editor: e }) => {
      const html = e.isEmpty ? "" : e.getHTML()
      onChange?.(html)
    },
    onBlur: () => onBlur?.(),
  })

  // Keep the editor in sync when `value` changes externally (e.g. form reset).
  React.useEffect(() => {
    if (!editor) return
    const current = editor.isEmpty ? "" : editor.getHTML()
    const next = value || ""
    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [value, editor])

  React.useEffect(() => {
    editor?.setEditable(!disabled)
  }, [disabled, editor])

  const editorId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined)

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={editorId} className="block text-foreground mb-1">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <div
        data-slot="rich-text-editor"
        aria-invalid={!!error}
        {...rest}
        id={editorId}
        className={cn(
          "flex w-full flex-col rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          disabled && "cursor-not-allowed opacity-50",
          "dark:bg-input/30",
          className
        )}
      >
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} className="[&_.tiptap]:outline-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
