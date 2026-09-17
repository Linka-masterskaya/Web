import { z } from 'zod'
import { sectionSchema } from './content-item.schema'

export const folderTreeItemSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(1),
    parent_id: z.string().uuid().nullable().optional(),
    section: sectionSchema,
    kind: z.enum(['folder', 'student']),
    student_id: z.string().uuid().nullable().optional(),
    depth: z.number().int().min(0).max(4),
  })
  .transform((folder) => ({
    id: folder.id,
    name: folder.name,
    parenrId: folder.parent_id ?? null,
    section: folder.section,
    kind: folder.kind,
    studentId: folder.student_id ?? null,
    depth: folder.depth,
  }))

export const folderTreeItemsResponseSchema = z.array(folderTreeItemSchema)

export const getFolderChildrenParamsSchema = z.object({
  section: sectionSchema,
  parentId: z.string().uuid().nullable().optional(),
})

export type TFolderTreeItem = z.infer<typeof folderTreeItemSchema>
export type TFolderTreeItemsResponse = z.infer<typeof folderTreeItemsResponseSchema>
export type TGetFolderChildrenParams = z.infer<typeof getFolderChildrenParamsSchema>
