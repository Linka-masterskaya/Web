import { z } from 'zod'

export const updateSetTitleParamsSchema = z.object({
  setId: z.string().uuid(),
  title: z.string().trim().min(1),
})

export type TUpdateSetTitleParams = z.infer<typeof updateSetTitleParamsSchema>
