import { getIsAuth } from '@entities/auth'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getSectionContents } from '../api/get-section-contents'
import { folderQueryKeys } from '../lib/query-keys'
import type { TGetSectionContentsParams } from '../model/content-item.schema'

const SECTION_CONTENTS_STALE_TIME_MS = 30_000

type TUseSectionContentsOptions = {
  enabled?: boolean
}

export const useSectionContents = (
  params: TGetSectionContentsParams,
  options?: TUseSectionContentsOptions,
) =>
  useQuery({
    queryKey: folderQueryKeys.sectionContents(params),
    queryFn: () => getSectionContents(params),
    staleTime: SECTION_CONTENTS_STALE_TIME_MS,
    placeholderData: keepPreviousData,
    enabled: (options?.enabled ?? true) && getIsAuth(),
  })
