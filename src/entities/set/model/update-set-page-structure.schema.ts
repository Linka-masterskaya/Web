import { z } from 'zod'

export const updateSetPageStructureParamsSchema = z.object({
  pageId: z.string().min(1),
  primaryCount: z.number().int().min(1).max(24),
  secondaryCount: z.number().int().min(1).max(24).optional(),
})

export type TUpdateSetPageStructureParams = z.infer<typeof updateSetPageStructureParamsSchema>
