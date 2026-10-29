import { folderQueryKeys } from '@entities/folder'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { publishSet } from '../api/publish-set'
import { setQueryKeys } from '../lib/query-keys'

export const usePublishSet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: publishSet,
    onSuccess: async (_set, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: setQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: setQueryKeys.detail(variables.setId) }),
        // Публикация меняет содержимое папки Библиотеки
        queryClient.invalidateQueries({ queryKey: folderQueryKeys.all }),
      ])
    },
  })
}
