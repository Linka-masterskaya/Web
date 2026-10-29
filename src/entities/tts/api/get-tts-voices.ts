import { apiClient } from '@shared/lib/api'
import { type TTtsVoice, ttsVoicesResponseSchema } from '../model/tts.schema'

export const getTtsVoices = async (): Promise<TTtsVoice[]> => {
  // Получаем список доступных голосов с бэкенда
  const data = await apiClient.get('tts/voices').json(ttsVoicesResponseSchema)

  return data.voices
}
