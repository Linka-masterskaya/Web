import { LIBRARY_SEARCH_RESULTS_LIMIT } from '../config'
import { mockCards } from '../mocks/library-data'
import { libraryCardSchema, type TLibraryCard } from '../model/library.schema'

// TODO: заменить на apiClient.get('library/cards', { searchParams: { search, limit } }).json()
// после появления backend API. Контракт: поиск по title, ранжирование «сначала совпадения
// с начала названия», не более LIBRARY_SEARCH_RESULTS_LIMIT результатов.
export const searchLibraryCards = async (query: string): Promise<TLibraryCard[]> => {
  const normalizedQuery = query.trim().toLowerCase()

  const matches = mockCards
    .filter((card) => card.title.toLowerCase().includes(normalizedQuery))
    .sort(
      (cardA, cardB) =>
        Number(cardB.title.toLowerCase().startsWith(normalizedQuery)) -
        Number(cardA.title.toLowerCase().startsWith(normalizedQuery)),
    )
    .slice(0, LIBRARY_SEARCH_RESULTS_LIMIT)

  return libraryCardSchema.array().parse(matches)
}
