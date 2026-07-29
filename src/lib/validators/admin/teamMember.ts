import { z } from "zod"

export const teamMemberBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().optional().default(""),
  avatarUrl: z.string().optional().default(""),
  linkedIn: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
  isFounder: z.boolean().default(false),
})

export const teamMemberSchema = teamMemberBaseSchema.superRefine((data, ctx) => {
  if (data.isFounder && !data.avatarUrl?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Avatar is required when featuring as Founder on the About page",
      path: ["avatarUrl"],
    })
  }
})

export type TeamMemberInput = z.infer<typeof teamMemberSchema>
