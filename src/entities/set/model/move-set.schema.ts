import { z } from 'zod'

export const moveSetParamsSchema = z.object({
  setId: z.string().trim().min(1),
  folderId: z.string().trim().min(1),
})

export type TMoveSetParams = z.infer<typeof moveSetParamsSchema>
