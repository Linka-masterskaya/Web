import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSetPage } from '../api/create-set-page'
import type { TSetPageType } from '../model/set-config.schema'
import { setQueryKeys } from '../lib/query-keys'

export const useCreateSetPage = (setId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (type: TSetPageType) => createSetPage(setId, type),
    onSuccess: (set) => {
      queryClient.setQueryData(setQueryKeys.detail(setId), set)
    },
  })
}
