import type { TSection } from '@entities/section-content'
import { z } from 'zod'
import type { TRouteQueryParamsInput } from '../types'

const folderIdSchema = z.string().uuid()

type TCreateSetSectionQueryParams = {
  section?: TSection | null
  folderId?: string | null
}

/** Query-контекст возврата: раздел и папка, из которой открыли набор. */
export const createSetSectionQuery = (
  sectionOrParams?: TSection | null | TCreateSetSectionQueryParams,
  folderId?: string | null,
): TRouteQueryParamsInput | undefined => {
  const params: TCreateSetSectionQueryParams =
    sectionOrParams != null && typeof sectionOrParams === 'object'
      ? sectionOrParams
      : { section: sectionOrParams, folderId }

  const section = params.section
  const hasSection = section === 'library' || section === 'my' || section === 'students'
  const parsedFolderId = folderIdSchema.safeParse(params.folderId ?? undefined)

  if (!hasSection && !parsedFolderId.success) {
    return undefined
  }

  return {
    ...(hasSection ? { section } : {}),
    ...(parsedFolderId.success ? { folderId: parsedFolderId.data } : {}),
  }
}
