import { getIsAuth } from '@entities/auth'
import { useQuery } from '@tanstack/react-query'
import { getSectionContents } from '../api/get-section-contents'
import { folderQueryKeys } from '../lib/query-keys'
import type { TGetSectionContentsParams } from '../model/content-item.schema'

const SECTION_CONTENTS_STALE_TIME_MS = 30_000

export const useSectionContents = (params: TGetSectionContentsParams) =>
  useQuery({
    queryKey: folderQueryKeys.sectionContents(params),
    queryFn: () => getSectionContents(params),
    staleTime: SECTION_CONTENTS_STALE_TIME_MS,
    enabled: getIsAuth(),
  })
