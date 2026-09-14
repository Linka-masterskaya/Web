import { apiClient } from '@shared/lib/api'
import { z } from 'zod'

const ttsJobResponseSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'succeeded', 'failed']),
  media_id: z.uuid().optional(),
})

export type TTtsJob = z.infer<typeof ttsJobResponseSchema>

export const getTtsJob = async (jobId: string): Promise<TTtsJob> => {
  // Проверяем статус асинхронной задачи и получаем media_id после успешной генерации
  return apiClient.get(`tts/${jobId}`).json(ttsJobResponseSchema)
}
