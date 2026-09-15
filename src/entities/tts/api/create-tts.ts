import { apiClient } from '@shared/lib/api'
import { z } from 'zod'

const createTtsResponseSchema = z.object({
  job_id: z.uuid(),
})

type TCreateTtsParams = {
  text: string
  voice: string
}

export const createTts = async ({ text, voice }: TCreateTtsParams, signal?: AbortSignal) => {
  // Запускаем генерацию аудио и получаем идентификатор задачи job_id
  return apiClient
    .post('tts', {
      signal,
      json: {
        text,
        voice,
      },
    })
    .json(createTtsResponseSchema)
}
