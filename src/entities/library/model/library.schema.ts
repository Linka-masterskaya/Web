import { z } from 'zod'

export const libraryCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const libraryCardSchema = z.object({
  id: z.number(),
  title: z.string(),
  image: z.string(),
  categoryId: z.number(),
})

export type TLibraryCategory = z.infer<typeof libraryCategorySchema>
export type TLibraryCard = z.infer<typeof libraryCardSchema>
