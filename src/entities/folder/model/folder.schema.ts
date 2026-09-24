import { z } from 'zod'

import { sectionSchema } from './content-item.schema'

const folderResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(1),
    parent_id: z.string().uuid().nullable(),
    section: sectionSchema,
    kind: z.enum(['folder', 'student']),
    student_id: z.string().uuid().nullable(),
  })
  .transform(({ id, name, parent_id, section, kind, student_id }) => ({
    id,
    name,
    parentId: parent_id,
    section,
    kind,
    studentId: student_id,
  }))

export const foldersResponseSchema = z.array(folderResponseSchema)

export type TFolder = z.infer<typeof folderResponseSchema>
export type TFoldersResponse = z.infer<typeof foldersResponseSchema>
