import {
  STUDENT_DEFAULT_SORT_FIELD,
  STUDENT_DEFAULT_SORT_ORDER,
  STUDENT_LEVEL_OPTIONS,
  STUDENT_SORT_FIELDS,
  type TStudentsListParams,
} from '@entities/student'
import type { TRouteQueryParamsState } from '@shared/lib/routes'

/**
 * Разбирает query-параметры URL в параметры клиентской
 * фильтрации/сортировки с валидацией и fallback на умолчания.
 */
export const parseStudentsListParams = (
  queryParams: TRouteQueryParamsState,
): TStudentsListParams => {
  const sort = STUDENT_SORT_FIELDS.includes(queryParams.sort as never)
    ? (queryParams.sort as TStudentsListParams['sort'])
    : STUDENT_DEFAULT_SORT_FIELD

  const order =
    queryParams.order === 'asc' || queryParams.order === 'desc'
      ? queryParams.order
      : STUDENT_DEFAULT_SORT_ORDER

  const query = queryParams.search || undefined

  const age = parsePositiveInt(queryParams.age) ?? undefined

  const level =
    queryParams.level !== null && STUDENT_LEVEL_OPTIONS.includes(queryParams.level as never)
      ? (queryParams.level as TStudentsListParams['level'])
      : undefined

  return {
    sort,
    order,
    query,
    age,
    level,
  }
}

const parsePositiveInt = (value: string | null): number | null => {
  if (value === null) return null

  const num = Number(value)

  if (!Number.isFinite(num) || !Number.isInteger(num) || num < 1) return null

  return num
}
