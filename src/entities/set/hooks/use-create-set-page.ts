import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSetPage } from '../api/create-set-page'
import { setQueryKeys } from '../lib/query-keys'
import type { TSetPageType } from '../model/set-config.schema'

export const useCreateSetPage = (setId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (type: TSetPageType) => createSetPage(setId, type),
    onSuccess: (set) => {
      queryClient.setQueryData(setQueryKeys.detail(setId), set)
    },
  })
}
