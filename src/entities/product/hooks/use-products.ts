import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/get-products'
import { productQueryKeys } from '../lib/query-keys'

const PRODUCTS_LIST_STALE_TIME_MS = 60_000

export const useProducts = (limit = 12) =>
  useQuery({
    queryKey: productQueryKeys.list(limit), // cache entry key; each limit has its own cache
    queryFn: () => getProducts(limit), // fetcher; runs when data is missing or stale
    placeholderData: keepPreviousData, // keep previous list while loading next limit
    staleTime: PRODUCTS_LIST_STALE_TIME_MS, // ms while data is considered fresh (no background refetch)
    gcTime: PRODUCTS_LIST_STALE_TIME_MS * 5, // ms to keep unused cache in memory after unsubscribe
    refetchOnMount: false, // do not refetch when the component remounts
    refetchOnWindowFocus: false, // do not refetch when the browser tab regains focus
    refetchOnReconnect: false, // do not refetch when the network connection is restored
  })
