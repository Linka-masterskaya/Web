import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFolder } from '../api/delete-folder'
import { folderQueryKeys } from '../lib/query-keys'

export const useDeleteFolder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderQueryKeys.all })
    },
  })
}
