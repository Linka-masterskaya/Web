import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moveSet } from '../api/move-set'
import { setQueryKeys } from '../lib/query-keys'

export const useMoveSet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: moveSet,
    onSuccess: (_data, { setId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: setQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: setQueryKeys.detail(setId) }),
      ]),
  })
}
