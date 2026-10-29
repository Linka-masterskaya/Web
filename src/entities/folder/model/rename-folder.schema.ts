import { z } from 'zod'

export const renameFolderParamsSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
})

export const renameFolderResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(1),
    parent_id: z.string().uuid().nullable().optional(),
  })
  .transform((folder) => ({
    id: folder.id,
    name: folder.name,
    parentId: folder.parent_id ?? null,
  }))

export type TRenameFolderParams = z.infer<typeof renameFolderParamsSchema>
export type TRenameFolderResponse = z.infer<typeof renameFolderResponseSchema>
