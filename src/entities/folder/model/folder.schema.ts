import { z } from 'zod'

export const folderSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  parentId: z.string().trim().min(1).nullable().optional(),
})

export const foldersResponseSchema = z.array(folderSchema)

export type TFolder = z.infer<typeof folderSchema>
export type TFoldersResponse = z.infer<typeof foldersResponseSchema>
