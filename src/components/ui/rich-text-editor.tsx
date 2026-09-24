"use client"

import * as React from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import { TableKit } from "@tiptap/extension-table"
import { TextStyle, Color, BackgroundColor } from "@tiptap/extension-text-style"
import TextAlign from "@tiptap/extension-text-align"
import { toast } from "sonner"
import { AlertCircle, Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, LinkIcon, Code, Undo2, Redo2, ChevronDown, Quote, Minus, ImageIcon, Loader2, Upload, Table2, Baseline, Highlighter, Check, Ban, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { isHtmlBody, linkifyHtml, normalizeCmsHtml, sanitizeHtml } from "@/lib/sanitize-html"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"
import { uploadEditorImage } from "@/lib/admin/uploadEditorImage"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const BLOCK_STYLES = [
  { label: "Paragraph", isActive: (editor: Editor) => editor.isActive("paragraph") && !editor.isActive("heading"), run: (editor: Editor) => editor.chain().focus().setParagraph().run() },
  { label: "Heading 1", isActive: (editor: Editor) => editor.isActive("heading", { level: 1 }), run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: "Heading 2", isActive: (editor: Editor) => editor.isActive("heading", { level: 2 }), run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: "Heading 3", isActive: (editor: Editor) => editor.isActive("heading", { level: 3 }), run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run() },
]

/**
 * Fixed text-colour / highlight swatches. Values are CONCRETE colours, not
 * `var(--token)` — TipTap's Color/BackgroundColor extensions parse the mark
 * back from `element.style.color`, and Chrome returns `""` there for a `var()`
 * value, so a token-based swatch silently drops on the next re-parse (reload /
 * paste / setContent). The text hues are mid-tone so they stay legible on both
 * the light and the dark admin surface; highlights are translucent so they
 * adapt on their own. Near-black values are rejected by the sanitiser
 * (`NON_BLACK_COLOR`), so keep these vivid.
 */
const RTE_TEXT_SWATCHES = [
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#ea580c" },
  { label: "Amber", value: "#b45309" },
  { label: "Green", value: "#15803d" },
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#9333ea" },
] as const

const RTE_HIGHLIGHTS = [
  { label: "Yellow", value: "rgba(250, 204, 21, 0.4)" },
  { label: "Green", value: "rgba(74, 222, 128, 0.35)" },
  { label: "Blue", value: "rgba(96, 165, 250, 0.35)" },
  { label: "Pink", value: "rgba(244, 114, 182, 0.35)" },
  { label: "Orange", value: "rgba(251, 146, 60, 0.4)" },
] as const

/**
 * The editor's DropdownMenu / Popover content portals to `document.body`,
 * outside the `.admin-light` / `.admin-dark` wrapper, so its `--popover*` /
 * `--foreground` tokens would fall back to the public-site palette and go
 * unreadable. Re-applying the current admin theme class on the portaled
 * content re-anchors those tokens regardless of `.dark` on <html> (#418).
 */
function useAdminThemeClass() {
  return useAdminTheme().theme === "dark" ? "admin-dark" : "admin-light"
}

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
  const adminThemeClass = useAdminThemeClass()

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
      <PopoverContent className={cn(adminThemeClass, "w-72")} align="start">
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

function ImageButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState("")
  const [uploading, setUploading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)
  const adminThemeClass = useAdminThemeClass()

  function insert(src: string) {
    const trimmed = src.trim()
    if (!trimmed) return
    editor.chain().focus().setImage({ src: trimmed }).run()
    setUrl("")
    setOpen(false)
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setUploading(true)
    try {
      insert(await uploadEditorImage(file))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          <ToolbarButton onClick={() => setOpen(true)} disabled={uploading} label="Insert image">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
          </ToolbarButton>
        </span>
      </PopoverTrigger>
      <PopoverContent className={cn(adminThemeClass, "w-80 space-y-2")} align="start">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            insert(url)
          }}
        >
          <Input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…/image.png"
            className="h-8"
          />
          <Button type="submit" size="sm" disabled={!url.trim()}>
            Add
          </Button>
        </form>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </PopoverContent>
    </Popover>
  )
}

/** Shared fixed-swatch menu for the text-colour and highlight toolbar buttons.
 * Portals to `document.body`, so it re-applies the admin theme class like the
 * other editor menus. Works on any selection, including a linked one — the
 * marks compose. */
function SwatchMenu({
  label,
  icon,
  swatches,
  activeValue,
  onPick,
  onClear,
}: {
  label: string
  icon: React.ReactNode
  swatches: readonly { label: string; value: string }[]
  activeValue: string | undefined
  onPick: (value: string) => void
  onClear: () => void
}) {
  const adminThemeClass = useAdminThemeClass()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span>
          <ToolbarButton onClick={() => {}} active={!!activeValue} label={label}>
            {icon}
          </ToolbarButton>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn(adminThemeClass, "w-auto")}>
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{label}</DropdownMenuLabel>
        <div className="flex gap-1 px-1.5 pb-1">
          {swatches.map((s) => (
            <button
              key={s.label}
              type="button"
              aria-label={s.label}
              aria-pressed={activeValue === s.value}
              onClick={() => onPick(s.value)}
              className={cn(
                "size-6 rounded border transition-transform hover:scale-110",
                activeValue === s.value ? "border-primary ring-1 ring-primary" : "border-border",
              )}
              style={{ backgroundColor: s.value }}
            />
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onClear}>
          <Ban className="size-4" />
          Remove {label.toLowerCase()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ColorButton({ editor }: { editor: Editor }) {
  return (
    <SwatchMenu
      label="Text colour"
      icon={<Baseline className="size-4" />}
      swatches={RTE_TEXT_SWATCHES}
      activeValue={editor.getAttributes("textStyle").color as string | undefined}
      onPick={(value) => editor.chain().focus().setColor(value).run()}
      onClear={() => editor.chain().focus().unsetColor().run()}
    />
  )
}

function HighlightButton({ editor }: { editor: Editor }) {
  return (
    <SwatchMenu
      label="Highlight"
      icon={<Highlighter className="size-4" />}
      swatches={RTE_HIGHLIGHTS}
      activeValue={editor.getAttributes("textStyle").backgroundColor as string | undefined}
      onPick={(value) => editor.chain().focus().setBackgroundColor(value).run()}
      onClear={() => editor.chain().focus().unsetBackgroundColor().run()}
    />
  )
}

/** Hover / click an N×M grid to choose the table size (replaces the old fixed
 * 3×3). Keyboard users can tab to a cell and press Enter. */
function TableGridPicker({ onPick }: { onPick: (rows: number, cols: number) => void }) {
  const MAX = 8
  const [hover, setHover] = React.useState({ r: 0, c: 0 })
  return (
    <div className="p-1.5" onMouseLeave={() => setHover({ r: 0, c: 0 })}>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${MAX}, 1fr)` }}>
        {Array.from({ length: MAX * MAX }).map((_, i) => {
          const r = Math.floor(i / MAX) + 1
          const c = (i % MAX) + 1
          const on = r <= hover.r && c <= hover.c
          return (
            <button
              key={i}
              type="button"
              aria-label={`${r} by ${c}`}
              onMouseEnter={() => setHover({ r, c })}
              onFocus={() => setHover({ r, c })}
              onClick={() => onPick(r, c)}
              className={cn(
                "size-4 rounded-[2px] border",
                on ? "border-primary bg-primary/25" : "border-border",
              )}
            />
          )
        })}
      </div>
      <p className="mt-1 text-center text-[11px] text-muted-foreground">
        {hover.r > 0 ? `${hover.r} × ${hover.c}` : "Pick size"}
      </p>
    </div>
  )
}

/** prosemirror-tables has no "reset widths" command; clear `colwidth` on every
 * cell of the table holding the caret so the columns fall back to auto. */
function resetColumnWidths(editor: Editor) {
  const { state } = editor
  const { $from } = state.selection
  let depth = $from.depth
  while (depth > 0 && $from.node(depth).type.name !== "table") depth -= 1
  if (depth === 0) return
  const table = $from.node(depth)
  const tableStart = $from.start(depth)
  const tr = state.tr
  table.descendants((node, pos) => {
    if (node.type.name === "tableCell" || node.type.name === "tableHeader") {
      if (node.attrs.colwidth) {
        tr.setNodeMarkup(tableStart + pos, undefined, { ...node.attrs, colwidth: null })
      }
      return false
    }
    return true
  })
  if (tr.docChanged) editor.view.dispatch(tr)
  editor.commands.focus()
}

function TableButton({ editor }: { editor: Editor }) {
  const adminThemeClass = useAdminThemeClass()
  const inTable = editor.isActive("table")
  const [open, setOpen] = React.useState(false)
  const [headerRow, setHeaderRow] = React.useState(true)
  const [confirmingDelete, setConfirmingDelete] = React.useState(false)

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setConfirmingDelete(false)
      }}
    >
      <DropdownMenuTrigger asChild>
        <span>
          <ToolbarButton onClick={() => {}} active={inTable} label="Table">
            <Table2 className="size-4" />
          </ToolbarButton>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn(adminThemeClass, "w-52")}>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Insert table</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={cn(adminThemeClass, "w-auto")}>
            <DropdownMenuCheckboxItem
              checked={headerRow}
              onCheckedChange={setHeaderRow}
              onSelect={(e) => e.preventDefault()}
            >
              Header row
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <TableGridPicker
              onPick={(rows, cols) => {
                editor.chain().focus().insertTable({ rows, cols, withHeaderRow: headerRow }).run()
                setOpen(false)
              }}
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!inTable}>Row</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={adminThemeClass}>
            <DropdownMenuItem onSelect={() => editor.chain().focus().addRowBefore().run()}>Insert above</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().addRowAfter().run()}>Insert below</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().deleteRow().run()}>Delete row</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!inTable}>Column</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={adminThemeClass}>
            <DropdownMenuItem onSelect={() => editor.chain().focus().addColumnBefore().run()}>Insert left</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().addColumnAfter().run()}>Insert right</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().deleteColumn().run()}>Delete column</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!inTable}>Headers</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={adminThemeClass}>
            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleHeaderRow().run()}>Toggle header row</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleHeaderColumn().run()}>Toggle header column</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().toggleHeaderCell().run()}>Toggle header cell</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!inTable}>Cells</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={adminThemeClass}>
            <DropdownMenuItem onSelect={() => editor.chain().focus().mergeCells().run()}>Merge cells</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().splitCell().run()}>Split cell</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().mergeOrSplit().run()}>Merge or split</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!inTable}>Align cell</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={adminThemeClass}>
            <DropdownMenuItem onSelect={() => editor.chain().focus().setTextAlign("left").run()}>
              <AlignLeft className="size-4" />
              Left
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().setTextAlign("center").run()}>
              <AlignCenter className="size-4" />
              Center
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => editor.chain().focus().setTextAlign("right").run()}>
              <AlignRight className="size-4" />
              Right
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem disabled={!inTable} onSelect={() => resetColumnWidths(editor)}>
          Reset column widths
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={!inTable}
          variant="destructive"
          onSelect={(e) => {
            if (!confirmingDelete) {
              e.preventDefault()
              setConfirmingDelete(true)
              return
            }
            editor.chain().focus().deleteTable().run()
            setConfirmingDelete(false)
          }}
        >
          <Check className={cn("size-4", !confirmingDelete && "opacity-0")} />
          {confirmingDelete ? "Click again to delete" : "Delete table"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const activeStyle = BLOCK_STYLES.find((s) => s.isActive(editor)) ?? BLOCK_STYLES[0]
  const adminThemeClass = useAdminThemeClass()

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
        <DropdownMenuContent align="start" className={adminThemeClass}>
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
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Blockquote">
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Horizontal rule">
        <Minus className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ColorButton editor={editor} />
      <HighlightButton editor={editor} />

      <Separator orientation="vertical" className="mx-1 h-5" />

      <LinkButton editor={editor} />
      <ImageButton editor={editor} />
      <TableButton editor={editor} />
    </div>
  )
}

/** External value only — not called from onUpdate, so typing is not re-normalized. */
function editorHtml(value: string | undefined): string {
  const raw = value || ""
  if (!raw) return ""
  const normalized = normalizeCmsHtml(raw)
  if (normalized === raw) return raw
  if (!isHtmlBody(normalized)) return normalized
  return sanitizeHtml(linkifyHtml(normalized))
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
        // Dofollow by default — link equity matters for our own + outbound
        // links. `rel` is normalised again at render time (sanitize-html) so
        // existing `nofollow` content is fixed and internal links open in-tab.
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: { class: "rounded-md", loading: "lazy" },
      }),
      TableKit.configure({ table: { resizable: true } }),
      // Text-colour + highlight marks (toolbar swatch menus). Color/BackgroundColor
      // both build on TextStyle, so it must be listed first. Every value is a
      // `var(--rte-*)` token — see `RTE_TEXT_SWATCHES` / globals.css.
      TextStyle,
      Color,
      BackgroundColor,
      // Per-cell alignment for the table tool (cell content is paragraphs).
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: editorHtml(value),
    editable: !disabled,
    editorProps: {
      attributes: {
        // Colors come from the `[data-slot="rich-text-editor"] .tiptap` rule in
        // globals.css, which maps prose's `--tw-prose-*` vars to the admin
        // theme tokens. We deliberately do NOT use `dark:prose-invert` here:
        // the admin shell themes via `.admin-light`/`.admin-dark`, while the
        // `dark:` variant keys off `.dark` on <html> (set from the OS theme),
        // so the two can disagree and wash the text out.
        class: cn(
          "prose prose-sm max-w-none focus:outline-none px-3 py-2",
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
    const next = editorHtml(value)
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
        <Label htmlFor={editorId} className="block text-[var(--foreground)] mb-1">
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
          // Background + text color are pinned to the admin tokens in
          // globals.css ([data-slot="rich-text-editor"]) so the widget can't
          // inherit a mismatched `.dark`-keyed public palette (#418).
          "flex w-full flex-col rounded-md border border-input shadow-xs transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          disabled && "cursor-not-allowed opacity-50",
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
