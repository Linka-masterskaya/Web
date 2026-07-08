import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { searchLibraryCards } from '../api/search-library-cards'
import {
  LIBRARY_GC_TIME_MS,
  LIBRARY_SEARCH_MIN_QUERY_LENGTH,
  LIBRARY_STALE_TIME_MS,
} from '../config'
import { libraryQueryKeys } from '../lib/query-keys'

export const useLibraryCardSearch = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase()

  return useQuery({
    queryKey: libraryQueryKeys.cardSearch(normalizedQuery),
    queryFn: () => searchLibraryCards(normalizedQuery),
    enabled: normalizedQuery.length >= LIBRARY_SEARCH_MIN_QUERY_LENGTH,
    // Пока грузится новый запрос — показываем предыдущие результаты, чтобы dropdown не мигал
    placeholderData: keepPreviousData,
    staleTime: LIBRARY_STALE_TIME_MS,
    gcTime: LIBRARY_GC_TIME_MS,
  })
}
