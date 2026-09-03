import { z } from 'zod'

import { setConfigSchema } from './set-config.schema'

const setDifficultySchema = z.enum(['easy', 'medium', 'hard'])

/** Pack (OpenAPI) → доменная модель набора */
export const setSchema = z
  .object({
    id: z.string().uuid(),
    folder_id: z.string().uuid(),
    title: z.string(),
    age: z.number().int().min(3).max(18).nullable().optional(),
    difficulty: setDifficultySchema.nullable().optional(),
    goals: z.array(z.string()).nullable().optional(),
    notes: z.string().nullable().optional(),
    config: setConfigSchema,
  })
  .transform((pack) => ({
    id: pack.id,
    folderId: pack.folder_id,
    title: pack.title,
    age: pack.age ?? null,
    difficulty: pack.difficulty ?? null,
    goals: pack.goals ?? undefined,
    notes: pack.notes ?? undefined,
    config: pack.config,
    pages: pack.config.blocks,
  }))

export const setResponseSchema = setSchema.nullable()

export type TSet = z.infer<typeof setSchema>
export type TSetResponse = z.infer<typeof setResponseSchema>
