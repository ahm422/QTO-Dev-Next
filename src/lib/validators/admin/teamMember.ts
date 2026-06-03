import { z } from "zod"

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().optional().default(""),
  avatarUrl: z.string().optional().default(""),
  linkedIn: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type TeamMemberInput = z.infer<typeof teamMemberSchema>
