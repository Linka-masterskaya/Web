import { apiClient } from '@shared/lib/api'
import { libraryCategorySchema, type TLibraryCategory } from '../model/library.schema'

export const getLibraryCategories = async (): Promise<TLibraryCategory[]> =>
  apiClient.get('pictures/categories').json(libraryCategorySchema.array())
