import { z } from 'zod'

import { sectionSchema } from './content-item.schema'

export const createFolderParamsSchema = z.object({
  name: z.string().trim().min(1),
  section: sectionSchema,
  parentId: z.string().uuid().nullable().optional(),
  kind: z.enum(['folder', 'student']).default('folder'),
})

export const createFolderResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(1),
    parent_id: z.string().uuid().nullable().optional(),
    section: sectionSchema,
    kind: z.enum(['folder', 'student']),
  })
  .transform((folder) => ({
    id: folder.id,
    name: folder.name,
    parentId: folder.parent_id ?? null,
    section: folder.section,
    kind: folder.kind,
  }))

export type TCreateFolderParams = z.infer<typeof createFolderParamsSchema>
export type TCreateFolderResponse = z.infer<typeof createFolderResponseSchema>
