import { z } from 'zod'

export const setSchema = z.object({
  id: z.string().trim().min(1),
  folderId: z.string().trim().min(1).nullable().optional(),
})

export const setResponseSchema = setSchema.nullable()

export type TSet = z.infer<typeof setSchema>
export type TSetResponse = z.infer<typeof setResponseSchema>
