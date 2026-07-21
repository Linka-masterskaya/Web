import { z } from 'zod'

export const sendSetParamsSchema = z.object({
  setId: z.string().trim().min(1),
  email: z.string().trim().min(1).pipe(z.email()),
})

export const sendSetResponseSchema = sendSetParamsSchema

export type TSendSetParams = z.infer<typeof sendSetParamsSchema>
export type TSendSetResponse = z.infer<typeof sendSetResponseSchema>
