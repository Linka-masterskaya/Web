import { z } from 'zod'

export const copySetTargetSectionSchema = z.enum(['my', 'students'])

export const copySetToFoldersParamsSchema = z
  .object({
    setId: z.string().uuid(),
    folderIds: z.array(z.string().uuid()).min(1, 'Выберите хотя бы одну папку'),
  })
  .superRefine(({ folderIds }, context) => {
    if (new Set(folderIds).size !== folderIds.length) {
      context.addIssue({
        code: 'custom',
        path: ['folderIds'],
        message: 'Одна и та же папка выбрана несколько раз',
      })
    }
  })

export type TCopySetTargetSection = z.infer<typeof copySetTargetSectionSchema>
export type TCopySetToFoldersParams = z.infer<typeof copySetToFoldersParamsSchema>
