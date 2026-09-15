import { apiClient } from '@shared/lib/api'
import { LIBRARY_SEARCH_RESULTS_LIMIT } from '../config'
import { libraryPictureListSchema, type TLibraryCard } from '../model/library.schema'

export const searchLibraryCards = async (query: string): Promise<TLibraryCard[]> => {
  const normalizedQuery = query.trim().toLowerCase()

  const pictures = await apiClient
    .get('pictures/search', {
      searchParams: { query: normalizedQuery },
    })
    .json(libraryPictureListSchema)

  return pictures
    .sort(
      (cardA, cardB) =>
        Number(cardB.title.toLowerCase().startsWith(normalizedQuery)) -
        Number(cardA.title.toLowerCase().startsWith(normalizedQuery)),
    )
    .slice(0, LIBRARY_SEARCH_RESULTS_LIMIT)
}
