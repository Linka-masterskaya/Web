import { z } from 'zod'

export const setSchema = z.object({
  id: z.string().trim().min(1),
})

export const setResponseSchema = setSchema.nullable()

export type TSet = z.infer<typeof setSchema>
export type TSetResponse = z.infer<typeof setResponseSchema>
