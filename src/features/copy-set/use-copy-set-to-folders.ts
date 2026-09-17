import { folderQueryKeys } from '@entities/folder'
import { setQueryKeys } from '@entities/set'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { copySetToFolders } from './copy-set-to-folders'

export const useCopySetToFolders = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['sets', 'copy-to-folders'],
    mutationFn: copySetToFolders,
    retry: false,
    onSuccess: async (report) => {
      if (report.successes.length === 0) {
        return
      }

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
