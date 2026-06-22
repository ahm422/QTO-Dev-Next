import { Info, ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

type AdminContentContextProps = {
  publicPaths: { label: string; href: string }[]
  description: string
  component?: string
  defaultOpen?: boolean
}

export default function AdminContentContext({
  publicPaths,
  description,
  component,
  defaultOpen = false,
}: AdminContentContextProps) {
  return (
    <details
      open={defaultOpen}
      className="rounded-xl border border-blue-500/20 bg-blue-500/8 px-4 py-3"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-muted-foreground [&::-webkit-details-marker]:hidden">
        <Info className="h-4 w-4 shrink-0 text-blue-400" />
        <span className="flex-1 font-medium">Where is this content shown?</span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform open:rotate-180" />
      </summary>
      <div className="space-y-3 pt-3 text-sm text-foreground/80">
        <p>{description}</p>
        <div className="flex flex-wrap gap-2">
          {publicPaths.map(({ label, href }) => (
            <Button key={href + label} variant="outline" size="sm" asChild>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                {label}
              </a>
            </Button>
          ))}
        </div>
        {component && (
          <p className="font-mono text-xs text-muted-foreground">Component: {component}</p>
        )}
      </div>
    </details>
  )
}
