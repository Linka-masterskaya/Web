import { z } from 'zod'

export const setPageTypeSchema = z.enum([
  'grid',
  'single_choice',
  'multi_choice',
  'matching',
  'categories',
  'sequence',
])

export const setPageElementSchema = z
  .object({
    id: z.string().min(1),
    kind: z.enum(['text', 'image', 'audio']),
    value: z.string().optional(),
    media_id: z.string().uuid().nullable().optional(),
    media_url: z.string().optional(),
    source_picture_id: z.string().uuid().nullable().optional(),
  })
  .passthrough()

export const setPageSchema = z
  .object({
    id: z.string().min(1),
    type: setPageTypeSchema,
    elements: z.array(setPageElementSchema).min(1),
  })
  .passthrough()

export const setConfigSchema = z.object({
  metadata: z.object({
    version: z.literal('2.0'),
    title: z.string().optional(),
  }),
  settings: z.object({
    columns: z.number().int().min(1),
    rows: z.number().int().min(1),
  }),
  blocks: z.array(setPageSchema),
})

export type TSetPageType = z.infer<typeof setPageTypeSchema>
export type TSetPageElement = z.infer<typeof setPageElementSchema>
export type TSetPage = z.infer<typeof setPageSchema>
export type TSetConfig = z.infer<typeof setConfigSchema>
