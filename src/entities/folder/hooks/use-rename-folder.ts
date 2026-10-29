import { useMutation, useQueryClient } from '@tanstack/react-query'
import { renameFolder } from '../api/rename-folder'
import { folderQueryKeys } from '../lib/query-keys'

export const useRenameFolder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: renameFolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: folderQueryKeys.all })
    },
  })
}
