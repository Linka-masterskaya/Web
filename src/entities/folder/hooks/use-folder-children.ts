import { useQuery } from '@tanstack/react-query'
import type { TGetFolderChildrenParams } from '..'
import { folderQueryKeys, getFolderChildren } from '..'

const FOLDER_CHILDREN_STALE_TIME_MS = 60000

export const useFolderChildren = (params: TGetFolderChildrenParams) =>
  useQuery({
    queryKey: [...folderQueryKeys.all, 'children', params.section, params.parentId ?? null],
    queryFn: ({ signal }) => getFolderChildren({ ...params, signal }),
    staleTime: FOLDER_CHILDREN_STALE_TIME_MS,
  })
