import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSetPageType } from '../api/update-set-page-type'
import { mergeSet } from '../lib/merge-set'
import { setMutationKeys, setQueryKeys } from '../lib/query-keys'
import type { TSet } from '../model/set.schema'
import type { TSetPageType } from '../model/set-config.schema'

type TUpdateSetPageTypeVariables = {
  pageId: string
  type: TSetPageType
}

export const useUpdateSetPageType = (setId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: setMutationKeys.updatePageType(setId),
    mutationFn: ({ pageId, type }: TUpdateSetPageTypeVariables) =>
      updateSetPageType(setId, pageId, type),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: setQueryKeys.detail(setId) })
    },
    onSuccess: (set) => {
      queryClient.setQueryData<TSet>(setQueryKeys.detail(setId), (currentSet) =>
        mergeSet(currentSet, set),
      )
    },
  })
}
