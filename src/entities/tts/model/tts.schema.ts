import { z } from 'zod'

// Схема одного голоса, который возвращает API
export const ttsVoiceSchema = z.object({
  id: z.string(),
  name: z.string(),
})

// Схема ответа API со списком доступных голосов
export const ttsVoicesResponseSchema = z.object({
  voices: z.array(ttsVoiceSchema),
})

export type TTtsVoice = z.infer<typeof ttsVoiceSchema>
