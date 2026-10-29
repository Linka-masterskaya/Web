import { useQuery } from '@tanstack/react-query'
import { getSet } from '../api/get-set'
import { setQueryKeys } from '../lib/query-keys'

export const useSet = (id: string) =>
  useQuery({
    queryKey: setQueryKeys.detail(id),
    queryFn: () => getSet(id),
    enabled: id.trim().length > 0,
  })
