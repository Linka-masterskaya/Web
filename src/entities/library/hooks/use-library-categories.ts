import { useQuery } from '@tanstack/react-query'
import { getLibraryCategories } from '../api/get-library-categories'
import { LIBRARY_GC_TIME_MS, LIBRARY_STALE_TIME_MS } from '../config'
import { libraryQueryKeys } from '../lib/query-keys'

export const useLibraryCategories = () =>
  useQuery({
    queryKey: libraryQueryKeys.categories(),
    queryFn: getLibraryCategories,
    staleTime: LIBRARY_STALE_TIME_MS,
    gcTime: LIBRARY_GC_TIME_MS,
  })
