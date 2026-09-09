import { z } from 'zod'

export const duplicateSetParamsSchema = z.object({
  setId: z.string().uuid(),
  folderId: z.string().uuid().optional(),
})

export type TDuplicateSetParams = z.infer<typeof duplicateSetParamsSchema>
