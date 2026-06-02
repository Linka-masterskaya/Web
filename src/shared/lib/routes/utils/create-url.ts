import { routeQueryParams } from '../config'
import type { TCreateUrlArgs, TRouterPathValue } from '../types'

export const createUrl = <T extends TRouterPathValue>(...args: TCreateUrlArgs<T>): string => {
  const [path, params, queryParams] = args

  let url: string = `/${path}`

  if (params) {
    for (const key of Object.keys(params) as Array<keyof typeof params>) {
      url = url.replace(`:${String(key)}`, params[key])
    }
  }

  if (queryParams) {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined) continue

      const queryKey = routeQueryParams[key as keyof typeof routeQueryParams]
      searchParams.set(queryKey, value)
    }

    const queryString = searchParams.toString()

    if (queryString) {
      url = `${url}?${queryString}`
    }
  }

  return url
}
