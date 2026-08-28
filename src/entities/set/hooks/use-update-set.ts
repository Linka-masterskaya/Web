import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSet } from '../api/update-set'
import { setQueryKeys } from '../lib/query-keys'

export const useUpdateSet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: setQueryKeys.lists(),
      })
    },
  })
}
