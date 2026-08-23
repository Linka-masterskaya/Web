import { z } from 'zod'

import { setConfigSchema } from './set-config.schema'

export const setSchema = z
  .object({
    id: z.string().uuid(),
    folder_id: z.string().uuid(),
    title: z.string(),
    config: setConfigSchema,
  })
  .transform((pack) => ({
    id: pack.id,
    folderId: pack.folder_id,
    title: pack.title,
    config: pack.config,
    pages: pack.config.blocks,
  }))

export const setResponseSchema = setSchema.nullable()

export type TSet = z.infer<typeof setSchema>
export type TSetResponse = z.infer<typeof setResponseSchema>
