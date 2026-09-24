import { getIsAuth } from '@entities/auth'
import { useQuery } from '@tanstack/react-query'

import { getFolders } from '../api/get-folders'
import { folderQueryKeys } from '../lib/query-keys'
import type { TSection } from '../model/content-item.schema'
import type { TFolder } from '../model/folder.schema'

const FOLDERS_STALE_TIME_MS = 60_000
const FOLDERS_LIMIT = 100

/** Целевые разделы для перемещения набора (библиотека недоступна как destination) */
const MOVE_TARGET_SECTIONS: TSection[] = ['my', 'students']

const getFoldersWithChildren = async (section: TSection): Promise<TFolder[]> => {
  const rootFolders = await getFolders({ section, limit: FOLDERS_LIMIT })

  const children = await Promise.all(
    rootFolders.map((folder) =>
      getFolders({
        section,
        parentId: folder.id,
        limit: FOLDERS_LIMIT,
      }),
    ),
  )

  return [...rootFolders, ...children.flat()]
}

const getMoveTargetFolders = async (): Promise<TFolder[]> => {
  const foldersBySection = await Promise.all(
    MOVE_TARGET_SECTIONS.map((section) => getFoldersWithChildren(section)),
  )

  return foldersBySection.flat()
}

export const useFolders = () =>
  useQuery({
    queryKey: folderQueryKeys.list(),
    queryFn: getMoveTargetFolders,
    staleTime: FOLDERS_STALE_TIME_MS,
    enabled: getIsAuth(),
  })
