import { z } from 'zod'

export const createSetParamsSchema = z.object({
  title: z.string().trim().min(1),
  folderId: z.string().uuid(),
})

export const createSetResponseSchema = z
  .object({
    id: z.string().uuid(),
    folder_id: z.string().uuid(),
  })
  .transform((pack) => ({
    id: pack.id,
    folderId: pack.folder_id,
  }))

export type TCreateSetParams = z.infer<typeof createSetParamsSchema>
export type TCreateSetResponse = z.infer<typeof createSetResponseSchema>
