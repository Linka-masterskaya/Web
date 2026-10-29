import { apiClient } from '@shared/lib/api'

export const getLibraryPictureContent = (pictureId: string): Promise<Blob> =>
  apiClient.get(`pictures/${pictureId}/content`).blob()
