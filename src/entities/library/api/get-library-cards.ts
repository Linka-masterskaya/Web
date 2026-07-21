import { mockCards } from '../mocks/library-data'
import { libraryCardSchema, type TLibraryCard } from '../model/library.schema'

// TODO: заменить на apiClient.get('...').json() после появления backend API
export const getLibraryCards = async (categoryId: number): Promise<TLibraryCard[]> =>
  libraryCardSchema.array().parse(mockCards.filter((card) => card.categoryId === categoryId))
