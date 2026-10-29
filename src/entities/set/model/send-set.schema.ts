import { z } from 'zod'

export const sendSetParamsSchema = z.object({
  setId: z.string().trim().min(1),
  targetId: z.string().trim().min(1),
})

export const sendSetResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type TSendSetParams = z.infer<typeof sendSetParamsSchema>
export type TSendSetResponse = z.infer<typeof sendSetResponseSchema>
