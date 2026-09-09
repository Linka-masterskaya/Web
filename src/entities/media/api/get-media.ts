import { apiClient } from '@shared/lib/api'
import { mediaSchema, type TMedia } from '../model/media.schema'

export const getMedia = async (mediaId: string): Promise<TMedia> => {
  return apiClient.get(`media/${mediaId}`).json(mediaSchema)
}
