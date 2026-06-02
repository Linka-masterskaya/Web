import type { routeParams, routeQueryParams, routerPath, routeSegments } from './config'

export type TRouteSegment = (typeof routeSegments)[keyof typeof routeSegments]

export type TRouteParam = (typeof routeParams)[keyof typeof routeParams]
export type TRouteParamName = keyof typeof routeParams

export type TRouteQueryParam = (typeof routeQueryParams)[keyof typeof routeQueryParams]
export type TRouteQueryParamName = keyof typeof routeQueryParams

export type TRouterPathValue = (typeof routerPath)[keyof typeof routerPath]

export type TExtractPathParamName<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | TExtractPathParamName<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never

export type TRouteParamsInput<T extends TRouterPathValue> = {
  [K in TExtractPathParamName<T> & TRouteParamName]: string
}

export type TRouteQueryParamsInput = Partial<Record<TRouteQueryParamName, string>>

export type TRouteQueryParamsState = {
  [K in TRouteQueryParamName]: string | null
}

export type TRouteQueryParamsUpdate = {
  [K in TRouteQueryParamName]?: string | null
}

export type TCreateUrlArgs<T extends TRouterPathValue> =
  TExtractPathParamName<T> extends never
    ? [path: T, params?: never, queryParams?: TRouteQueryParamsInput]
    : [path: T, params: TRouteParamsInput<T>, queryParams?: TRouteQueryParamsInput]
