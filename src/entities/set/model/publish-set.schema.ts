import { z } from 'zod'

// POST /packs/{id}/publication требует папку Библиотеки, в которую публикуется набор
export const publishSetParamsSchema = z.object({
  setId: z.string().uuid(),
  libraryFolderId: z.string().uuid(),
})

export const unpublishSetParamsSchema = z.object({
  setId: z.string().uuid(),
})

export type TPublishSetParams = z.infer<typeof publishSetParamsSchema>
export type TUnpublishSetParams = z.infer<typeof unpublishSetParamsSchema>
