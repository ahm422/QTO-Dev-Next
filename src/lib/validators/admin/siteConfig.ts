import { z } from "zod"

export const siteConfigSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  label: z.string().optional().default(""),
})

export type SiteConfigInput = z.infer<typeof siteConfigSchema>
