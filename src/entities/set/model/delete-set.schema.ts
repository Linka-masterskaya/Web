import { z } from 'zod'

export const deleteSetSchema = z.object({
  setId: z.string().uuid(),
})

export type TDeleteSetParams = z.infer<typeof deleteSetSchema>
