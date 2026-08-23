import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSet } from '../api/create-set'
import { setQueryKeys } from '../lib/query-keys'

export const useCreateSet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: setQueryKeys.lists() }),
  })
}
