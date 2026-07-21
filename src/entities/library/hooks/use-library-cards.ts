import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getLibraryCards } from '../api/get-library-cards'
import { LIBRARY_GC_TIME_MS, LIBRARY_STALE_TIME_MS } from '../config'
import { libraryQueryKeys } from '../lib/query-keys'

export const useLibraryCards = (categoryId: number | null) =>
  useQuery({
    queryKey: libraryQueryKeys.cards(categoryId ?? -1),
    queryFn: () => getLibraryCards(categoryId ?? -1),
    enabled: categoryId !== null,
    placeholderData: keepPreviousData,
    staleTime: LIBRARY_STALE_TIME_MS,
    gcTime: LIBRARY_GC_TIME_MS,
  })
