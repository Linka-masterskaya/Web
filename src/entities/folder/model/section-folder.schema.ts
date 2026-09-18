import { z } from 'zod'

import { sectionSchema } from './content-item.schema'

export const getSectionFoldersParamsSchema = z.object({
  section: sectionSchema,
})

/** Folder (OpenAPI) → папка раздела для выбора целевой папки */
export const sectionFolderSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(1),
    parent_id: z.string().uuid().nullable().optional(),
    kind: z.enum(['folder', 'student']).nullable().optional(),
    depth: z.number().int().min(0).nullable().optional(),
  })
  .transform((folder) => ({
    id: folder.id,
    name: folder.name,
    parentId: folder.parent_id ?? null,
    kind: folder.kind ?? 'folder',
    depth: folder.depth ?? 0,
  }))

export const sectionFoldersResponseSchema = z.array(sectionFolderSchema)

export type TGetSectionFoldersParams = z.infer<typeof getSectionFoldersParamsSchema>
export type TSectionFolder = z.infer<typeof sectionFolderSchema>
export type TSectionFoldersResponse = z.infer<typeof sectionFoldersResponseSchema>
