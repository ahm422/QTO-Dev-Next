import { z } from "zod"

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().optional().default(""),
  type: z.string().optional().default(""),
  description: z.string().optional().default(""),
  requirements: z.array(z.string()).default([]),
  niceToHave: z.array(z.string()).default([]),
  salaryRange: z.string().optional().default(""),
  applyUrl: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
  postedAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
})

export type JobInput = z.infer<typeof jobSchema>
