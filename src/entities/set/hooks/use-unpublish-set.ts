import { folderQueryKeys } from '@entities/folder'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unpublishSet } from '../api/unpublish-set'
import { setQueryKeys } from '../lib/query-keys'

export const useUnpublishSet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unpublishSet,
    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: setQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: setQueryKeys.detail(variables.setId) }),
        // Снятие публикации меняет содержимое папки Библиотеки
        queryClient.invalidateQueries({ queryKey: folderQueryKeys.all }),
      ])
    },
  })
}
