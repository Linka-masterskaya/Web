import { useQuery } from '@tanstack/react-query'

import { getFolders } from '../api/get-folders'
import { folderQueryKeys } from '../lib/query-keys'
import type { TSection } from '../model/content-item.schema'
import type { TFolder } from '../model/folder.schema'

const FOLDERS_STALE_TIME_MS = 60_000

const SECTIONS: TSection[] = ['library', 'my', 'students']

const getFoldersWithChildren = async (section: TSection): Promise<TFolder[]> => {
  const rootFolders = await getFolders({ section })

  const children = await Promise.all(
    rootFolders.map((folder) =>
      getFolders({
        section,
        parentId: folder.id,
      }),
    ),
  )

  return [...rootFolders, ...children.flat()]
}

const getAllFolders = async (): Promise<TFolder[]> => {
  const foldersBySection = await Promise.all(
    SECTIONS.map((section) => getFoldersWithChildren(section)),
  )

  return foldersBySection.flat()
}

export const useFolders = () =>
  useQuery({
    queryKey: folderQueryKeys.list(),
    queryFn: getAllFolders,
    staleTime: FOLDERS_STALE_TIME_MS,
  })
