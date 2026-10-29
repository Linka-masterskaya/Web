import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { TRouteQueryParamsUpdate } from '../types'
import { mergeRouteQueryParams, parseRouteQueryParams } from '../utils/route-query-params'

type TSetRouteQueryParamsOptions = {
  replace?: boolean
}

export const useRouteQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const queryParams = useMemo(() => parseRouteQueryParams(searchParams), [searchParams])

  const setQueryParams = useCallback(
    (
      updates: TRouteQueryParamsUpdate,
      shouldScroll = true,
      options?: TSetRouteQueryParamsOptions,
    ) => {
      setSearchParams(mergeRouteQueryParams(searchParams, updates), {
        replace: options?.replace ?? false,
        preventScrollReset: !shouldScroll,
      })
    },
    [searchParams, setSearchParams],
  )

  return { queryParams, setQueryParams }
}
