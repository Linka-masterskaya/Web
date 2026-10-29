import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFolder } from '../api/create-folder'
import { folderQueryKeys } from '../lib/query-keys'

export const useCreateFolder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: folderQueryKeys.all })
    },
  })
}
