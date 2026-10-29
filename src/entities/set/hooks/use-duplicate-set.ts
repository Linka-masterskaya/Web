import { folderQueryKeys } from '@entities/folder'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { duplicateSet } from '../api/duplicate-set'
import { setQueryKeys } from '../lib/query-keys'

export const useDuplicateSet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: duplicateSet,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: setQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: folderQueryKeys.all }),
      ])
    },
  })
}
