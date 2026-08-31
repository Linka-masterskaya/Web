import { z } from 'zod'
import { SET_LEVEL_VALUES, SET_VOICE_VALUES } from '../config'

export const setSettingsSchema = z.object({
  title: z.string().trim().min(1, 'Введите название набора'),
  age: z.string(),
  level: z.enum(SET_LEVEL_VALUES),
  voice: z.enum(SET_VOICE_VALUES),
  notes: z.string(),
  isTypingPack: z.boolean(),
  isAutoSpeak: z.boolean(),
  isQuizPack: z.boolean(),
})

export type TSetSettings = z.infer<typeof setSettingsSchema>
