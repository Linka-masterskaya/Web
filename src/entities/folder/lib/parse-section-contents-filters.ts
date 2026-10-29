import type { TRouteQueryParamsState } from '@shared/lib/routes'

import {
  sectionContentsDifficultySchema,
  type TSectionContentsDifficulty,
} from '../model/content-item.schema'

const SECTION_CONTENTS_AGE_MIN = 3
const SECTION_CONTENTS_AGE_MAX = 18
const SECTION_CONTENTS_FAVORITE_ACTIVE_VALUE = 'true'

export type TSectionContentsFilters = {
  query?: string
  age?: number
  difficulty?: TSectionContentsDifficulty
  isFavorite?: boolean
}

/**
 * Разбирает query-параметры URL в фильтры списка папок и наборов.
 * URL: `search`, `level`, `favorite` → бэкенд: `query`, `difficulty`, `is_favorite`.
 */
export const parseSectionContentsFilters = (
  queryParams: TRouteQueryParamsState,
): TSectionContentsFilters => {
  const query = queryParams.search?.trim() || undefined

  const age = parseAge(queryParams.age)

  const parsedDifficulty = sectionContentsDifficultySchema.safeParse(queryParams.level)
  const difficulty = parsedDifficulty.success ? parsedDifficulty.data : undefined

  const isFavorite =
    queryParams.favorite === SECTION_CONTENTS_FAVORITE_ACTIVE_VALUE ? true : undefined

  return {
    query,
    age,
    difficulty,
    isFavorite,
  }
}

const parseAge = (value: string | null): number | undefined => {
  if (value === null) {
    return undefined
  }

  const num = Number(value)

  if (!Number.isFinite(num) || !Number.isInteger(num)) {
    return undefined
  }

  if (num < SECTION_CONTENTS_AGE_MIN || num > SECTION_CONTENTS_AGE_MAX) {
    return undefined
  }

  return num
}
