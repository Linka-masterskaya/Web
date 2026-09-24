import { z } from 'zod'
import { setPageTypeSchema } from './set-config.schema'

// PUT /packs/{id}/config проверяется отдельной строгой схемой pkg/linka/schema.json.
// OpenAPI описывает тело лишь как object и не перечисляет эти ограничения.
const optionalMediaId = z.preprocess((value) => value ?? undefined, z.string().uuid().optional())

const elementPayloadSchema = z
  .object({
    id: z.string().min(1),
    kind: z.enum(['text', 'image', 'audio']),
    value: z.string().optional(),
    card_type: z.enum(['normal', 'text', 'empty', 'space']).optional(),
    media_id: optionalMediaId,
    source_picture_id: optionalMediaId,
    audio_media_id: optionalMediaId,
    speech_text: z.string().optional(),
  })
  .transform((card) => {
    const kind = card.card_type ?? 'normal'
    if (kind === 'empty' || kind === 'space') {
      return { id: card.id, kind }
    }
    const audioId = card.audio_media_id ?? (card.kind === 'audio' ? card.media_id : undefined)
    return {
      id: card.id,
      kind,
      text: card.value,
      image:
        card.kind === 'image' && (card.source_picture_id || card.media_id)
          ? card.source_picture_id
            ? { source_picture_id: card.source_picture_id }
            : { media_id: card.media_id }
          : undefined,
      audio: audioId ? { media_id: audioId, text: card.speech_text } : undefined,
    }
  })

const pagePayloadSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1).optional(),
    type: setPageTypeSchema,
    layout: z
      .object({ rows: z.number().int().min(1).max(100), columns: z.number().int().min(1).max(100) })
      .optional(),
    elements: z.array(elementPayloadSchema).min(1),
    answers: z.array(z.object({ element_id: z.string(), is_correct: z.boolean() })).optional(),
    sequence: z.array(z.object({ element_id: z.string(), order: z.number().int() })).optional(),
    pairs: z.array(z.object({ left_id: z.string(), right_id: z.string() })).optional(),
    categories: z
      .array(
        z.object({
          id: z.string(),
          element_id: z.string().optional(),
          name: z.string().optional(),
          items: z.array(z.string()),
        }),
      )
      .optional(),
  })
  .transform((page) => ({ ...page, layout: page.type === 'grid' ? page.layout : undefined }))

/** Белый список полей транспортного формата; состояние редактора не мутируется. */
export const setConfigPayloadSchema = z.object({
  metadata: z.object({ version: z.literal('2.0'), title: z.string().optional() }),
  settings: z.object({
    columns: z.number().int().min(1).max(100),
    rows: z.number().int().min(1).max(100),
  }),
  blocks: z.array(pagePayloadSchema),
})
