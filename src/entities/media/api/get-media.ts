import { apiClient } from '@shared/lib/api'
import { mediaSchema, type TMedia } from '../model/media.schema'

export const getMedia = async (mediaId: string, signal?: AbortSignal): Promise<TMedia> => {
  return apiClient.get(`media/${mediaId}`, { signal }).json(mediaSchema)
}
