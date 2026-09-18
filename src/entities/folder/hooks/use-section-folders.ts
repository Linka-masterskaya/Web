import { getIsAuth } from '@entities/auth'
import { useQuery } from '@tanstack/react-query'
import { getSectionFolders } from '../api/get-section-folders'
import { folderQueryKeys } from '../lib/query-keys'
import type { TSection } from '../model/content-item.schema'

const SECTION_FOLDERS_STALE_TIME_MS = 30_000

export const useSectionFolders = (section: TSection) =>
  useQuery({
    queryKey: folderQueryKeys.sectionList(section),
    queryFn: () => getSectionFolders({ section }),
    staleTime: SECTION_FOLDERS_STALE_TIME_MS,
    enabled: getIsAuth(),
  })
