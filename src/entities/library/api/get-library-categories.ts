import { mockCategories } from '../mocks/library-data'
import { libraryCategorySchema, type TLibraryCategory } from '../model/library.schema'

// TODO: заменить на apiClient.get('...').json() после появления backend API
export const getLibraryCategories = async (): Promise<TLibraryCategory[]> =>
  libraryCategorySchema.array().parse(mockCategories)
