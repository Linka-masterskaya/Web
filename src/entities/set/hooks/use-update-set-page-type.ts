import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSetPageType } from '../api/update-set-page-type'
import type { TSetPageType } from '../model/set-config.schema'
import { setQueryKeys } from '../lib/query-keys'

type TUpdateSetPageTypeVariables = {
  pageId: string
  type: TSetPageType
}

export const useUpdateSetPageType = (setId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pageId, type }: TUpdateSetPageTypeVariables) =>
      updateSetPageType(setId, pageId, type),
    onSuccess: (set) => {
      queryClient.setQueryData(setQueryKeys.detail(setId), set)
    },
  })
}
