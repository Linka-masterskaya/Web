import { useQuery } from '@tanstack/react-query'
import { getLibraryCards } from '../api/get-library-cards'
import { LIBRARY_GC_TIME_MS, LIBRARY_STALE_TIME_MS } from '../config'
import { libraryQueryKeys } from '../lib/query-keys'

export const useLibraryCards = (categoryId: string | null) =>
  useQuery({
    queryKey: libraryQueryKeys.cards(categoryId ?? ''),
    queryFn: () => {
      if (categoryId === null) {
        return Promise.reject(new Error('useLibraryCards: categoryId is not set yet'))
      }

      return getLibraryCards(categoryId)
    },
    enabled: categoryId !== null,
    retry: 1,
    staleTime: LIBRARY_STALE_TIME_MS,
    gcTime: LIBRARY_GC_TIME_MS,
  })
