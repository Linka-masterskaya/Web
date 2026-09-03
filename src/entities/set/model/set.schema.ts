import { z } from 'zod'

import { setConfigSchema } from './set-config.schema'

const setDifficultySchema = z.enum(['easy', 'medium', 'hard'])

export const setSchema = z
  .object({
    id: z.string().uuid(),
    folder_id: z.string().uuid(),
    title: z.string(),
    age_min: z.number().int().nullable().optional(),
    age_max: z.number().int().nullable().optional(),
    difficulty: setDifficultySchema.nullable().optional(),
    goals: z.array(z.string()).nullable().optional(),
    notes: z.string().nullable().optional(),
    config: setConfigSchema,
  })
  .transform((pack) => ({
    id: pack.id,
    folderId: pack.folder_id,
    title: pack.title,
    ageMin: pack.age_min ?? undefined,
    ageMax: pack.age_max ?? undefined,
    difficulty: pack.difficulty ?? undefined,
    goals: pack.goals ?? undefined,
    notes: pack.notes ?? undefined,
    config: pack.config,
    pages: pack.config.blocks,
  }))

export const setResponseSchema = setSchema.nullable()

export type TSet = z.infer<typeof setSchema>
export type TSetResponse = z.infer<typeof setResponseSchema>
