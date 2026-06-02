import type { TRouteParam, TRouteSegment } from '../types'

type TRoutePiece = TRouteSegment | TRouteParam

type TJoinRoute<T extends readonly TRoutePiece[]> = T extends readonly [
  infer Head extends TRoutePiece,
  ...infer Tail extends readonly TRoutePiece[],
]
  ? Tail extends readonly []
    ? Head
    : `${Head}/${TJoinRoute<Tail>}`
  : ''

export const defineRoute = <const T extends readonly TRoutePiece[]>(
  segments: T,
): TJoinRoute<T> => segments.join('/') as TJoinRoute<T>
