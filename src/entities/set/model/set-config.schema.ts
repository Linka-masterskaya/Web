import { z } from 'zod'

export const setPageTypeSchema = z.enum([
  'grid',
  'single_choice',
  'multi_choice',
  'matching',
  'categories',
  'sequence',
])

const editorElementSchema = z
  .object({
    id: z.string().min(1),
    kind: z.enum(['text', 'image', 'audio']),
    card_type: z.enum(['normal', 'text', 'empty', 'space']).optional(),
    value: z.string().optional(),
    media_url: z.string().optional(),
    source_picture_id: z.string().uuid().nullable().optional(),
  })
  .passthrough()

// Нормализуем серверную составную карточку в модель редактора;
// старые конфиги также продолжают читаться.
export const setPageElementSchema = z.preprocess((input) => {
  if (!input || typeof input !== 'object') {
    return input
  }
  const raw = input as Record<string, unknown>
  if (
    !['normal', 'empty', 'space'].includes(String(raw.kind)) &&
    !('text' in raw) &&
    !('image' in raw) &&
    !('audio' in raw)
  ) {
    return input
  }
  const image = raw.image as Record<string, unknown> | undefined
  const audio = raw.audio as Record<string, unknown> | undefined
  return {
    id: raw.id,
    kind: image ? 'image' : 'text',
    card_type: raw.kind,
    value: raw.text ?? '',
    media_id: image?.media_id,
    media_url: image?.media_url,
    source_picture_id: image?.source_picture_id,
    audio_media_id: audio?.media_id,
    speech_text: audio?.text,
  }
}, editorElementSchema)

export const setPageSchema = z
  .object({
    id: z.string().min(1),
    type: setPageTypeSchema,
    layout: z
      .object({ rows: z.number().int().min(1).max(100), columns: z.number().int().min(1).max(100) })
      .optional(),
    name: z.string().min(1).optional(),
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
