import { apiClient } from '@shared/lib/api'
import { libraryPictureListSchema, type TLibraryCard } from '../model/library.schema'

export const getLibraryCards = async (categoryId: string): Promise<TLibraryCard[]> =>
  apiClient.get(`pictures/category/${categoryId}/list`).json(libraryPictureListSchema)
