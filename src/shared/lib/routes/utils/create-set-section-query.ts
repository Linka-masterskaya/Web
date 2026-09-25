import type { TSection } from '@entities/section-content'
import type { TRouteQueryParamsInput } from '../types'

/** Query для сохранения раздела при навигации внутри студии набора. */
export const createSetSectionQuery = (
  section: TSection | null | undefined,
): TRouteQueryParamsInput | undefined => {
  if (section === 'library' || section === 'my' || section === 'students') {
    return { section }
  }

  return undefined
}
