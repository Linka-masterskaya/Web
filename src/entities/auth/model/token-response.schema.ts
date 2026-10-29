import { z } from 'zod'

export const tokenResponseSchema = z
  .object({
    access_token: z.string().min(1),
  })
  .transform((response) => ({
    accessToken: response.access_token,
  }))

export type TTokenResponse = z.infer<typeof tokenResponseSchema>
