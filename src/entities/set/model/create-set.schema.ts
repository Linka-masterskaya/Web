import { z } from 'zod'

export const createSetParamsSchema = z.object({
  title: z.string().trim().min(1),
  folderId: z.string().trim().min(1).nullable().optional(),
})

export type TCreateSetParams = z.infer<typeof createSetParamsSchema>
