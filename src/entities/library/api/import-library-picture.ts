import { apiClient } from '@shared/lib/api'
import { libraryPictureImportSchema, type TLibraryPictureImport } from '../model/library.schema'

export const importLibraryPicture = (pictureId: string): Promise<TLibraryPictureImport> =>
  apiClient.post(`pictures/${pictureId}/import`).json(libraryPictureImportSchema)
