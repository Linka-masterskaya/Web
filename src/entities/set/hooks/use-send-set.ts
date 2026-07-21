import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendSet } from '../api/send-set'
import { setQueryKeys } from '../lib/query-keys'

export const useSendSet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendSet,
    onSuccess: ({ setId }) => {
      queryClient.invalidateQueries({ queryKey: setQueryKeys.detail(setId) })
    },
  })
}
