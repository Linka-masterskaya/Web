import { z } from 'zod'

export const mediaSchema = z.object({
  id: z.string().uuid(),
  uploader_id: z.string().uuid(),
  name: z.string(),
  sha256: z.string(),
  media_type: z.string(),
  mime_type: z.string(),
  size_bytes: z.number().int(),
  created_at: z.string(),
  url: z.string(),
})

export type TMedia = z.infer<typeof mediaSchema>
