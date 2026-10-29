import { z } from 'zod'

export const libraryCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const libraryCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  categories: libraryCategorySchema.array(),
})

export type TLibraryCategory = z.infer<typeof libraryCategorySchema>
export type TLibraryCard = z.infer<typeof libraryCardSchema>

export const libraryPictureImportSchema = z
  .object({
    source_picture_id: z.string(),
    content_url: z.string(),
  })
  .transform((response) => ({
    sourcePictureId: response.source_picture_id,
    contentUrl: response.content_url,
  }))

export type TLibraryPictureImport = z.infer<typeof libraryPictureImportSchema>

const libraryPictureSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    mimeType: z.string().optional(),
    categories: libraryCategorySchema.array(),
    url: z.string().optional(),
  })
  .transform((picture) =>
    libraryCardSchema.parse({
      id: picture.id,
      title: picture.name,
      image: '',
      categories: picture.categories,
    }),
  )

export const libraryPictureListSchema = libraryPictureSchema.array()
