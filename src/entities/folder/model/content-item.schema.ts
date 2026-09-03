import { z } from 'zod'

export const sectionSchema = z.enum(['library', 'my', 'students'])

export const contentItemSchema = z
  .object({
    type: z.enum(['folder', 'pack']),
    id: z.string().uuid(),
    name: z.string().trim().min(1),
    kind: z.enum(['folder', 'student']).nullable().optional(),
    student_id: z.string().uuid().nullable().optional(),
    published: z.boolean().optional(),
    age: z.number().int().min(3).max(18).nullable().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).nullable().optional(),
    updated_at: z.string().min(1),
  })
  .transform((item) => ({
    type: item.type,
    id: item.id,
    name: item.name,
    kind: item.kind ?? null,
    studentId: item.student_id ?? null,
    published: item.published,
    age: item.age ?? null,
    difficulty: item.difficulty ?? null,
    updatedAt: item.updated_at,
  }))

export const sectionContentsResponseSchema = z.object({
  items: z.array(contentItemSchema),
  limit: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
})

export const sectionContentsDifficultySchema = z.enum(['easy', 'medium', 'hard'])

export const getSectionContentsParamsSchema = z.object({
  section: sectionSchema,
  parentId: z.string().uuid().nullable().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
  sort: z.enum(['name', 'updated_at']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  search: z.string().trim().min(1).optional(),
  age: z.number().int().min(3).max(18).optional(),
  difficulty: sectionContentsDifficultySchema.optional(),
})

export type TSection = z.infer<typeof sectionSchema>
export type TContentItem = z.infer<typeof contentItemSchema>
export type TSectionContentsResponse = z.infer<typeof sectionContentsResponseSchema>
export type TSectionContentsDifficulty = z.infer<typeof sectionContentsDifficultySchema>
export type TGetSectionContentsParams = z.infer<typeof getSectionContentsParamsSchema>
