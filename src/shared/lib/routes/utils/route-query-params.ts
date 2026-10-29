import { routeQueryParams } from '../config'
import type {
  TRouteQueryParamName,
  TRouteQueryParamsState,
  TRouteQueryParamsUpdate,
} from '../types'

export const parseRouteQueryParams = (search: string | URLSearchParams): TRouteQueryParamsState => {
  const searchParams = typeof search === 'string' ? new URLSearchParams(search) : search

  return Object.fromEntries(
    (Object.keys(routeQueryParams) as TRouteQueryParamName[]).map((name) => [
      name,
      searchParams.get(routeQueryParams[name]),
    ]),
  ) as TRouteQueryParamsState
}

export const mergeRouteQueryParams = (
  current: URLSearchParams,
  updates: TRouteQueryParamsUpdate,
): URLSearchParams => {
  const next = new URLSearchParams(current)

  for (const [name, value] of Object.entries(updates) as Array<
    [TRouteQueryParamName, string | null | undefined]
  >) {
    const key = routeQueryParams[name]

    if (value === undefined || value === null) {
      next.delete(key)
      continue
    }

    next.set(key, value)
  }

  return next
}
