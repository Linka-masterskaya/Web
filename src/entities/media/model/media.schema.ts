import { z } from 'zod'

// Ответ POST /media
export const mediaSchema = z.object({
  id: z.string(),
  uploader_id: z.string(),
  sha256: z.string(),
  mime_type: z.string(),
  size_bytes: z.number(),
  created_at: z.string(),
  url: z.string(),
})

export type TMedia = z.infer<typeof mediaSchema>
