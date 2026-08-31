import { apiClient } from '@shared/lib/api'
import { mediaSchema, type TMedia } from '../model/media.schema'

/**
 * Загружает файл в общее медиа-хранилище.
 * Возвращает id — его нужно слать в avatar_media_id при создании/обновлении ученика.
 */
export const uploadMedia = async (file: File): Promise<TMedia> => {
  const formData = new FormData()
  formData.append('file', file)

  const media = await apiClient.post('media', { body: formData }).json(mediaSchema)

  return media
}
