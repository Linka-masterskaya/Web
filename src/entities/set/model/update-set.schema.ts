import { z } from 'zod'

export const updateSetParamsSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  folderId: z.string().uuid(),
  age: z.number().int().min(3).max(18).nullable(),
  difficulty: z.enum(['easy', 'medium', 'hard']).nullable(),
  goals: z.array(z.string()),
  notes: z.string().nullable(),
})

export type TUpdateSetParams = z.infer<typeof updateSetParamsSchema>
