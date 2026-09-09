import { folderQueryKeys } from '@entities/folder'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSet } from '../api/delete-set'
import { setQueryKeys } from '../lib/query-keys'

export const useDeleteSet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSet,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: setQueryKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: folderQueryKeys.all,
        }),
      ])
    },
  })
}
