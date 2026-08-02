import { useQuery } from '@tanstack/react-query'
import { getFolders } from '../api/get-folders'
import { folderQueryKeys } from '../lib/query-keys'

const FOLDERS_STALE_TIME_MS = 60_000

export const useFolders = () =>
  useQuery({
    queryKey: folderQueryKeys.list(),
    queryFn: getFolders,
    staleTime: FOLDERS_STALE_TIME_MS,
  })
