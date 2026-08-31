import { z } from 'zod'

export const updateSetParamsSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  folderId: z.string().uuid(),
  ageMin: z.number(),
  ageMax: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  goals: z.array(z.string()),
  notes: z.string(),
})

export type TUpdateSetParams = z.infer<typeof updateSetParamsSchema>
