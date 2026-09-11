import { useMutation, useQueryClient } from '@tanstack/react-query'
import { duplicateSetPage } from '../api/duplicate-set-page'
import { mergeSet } from '../lib/merge-set'
import { setMutationKeys, setQueryKeys } from '../lib/query-keys'
import type { TSet } from '../model/set.schema'

export const useDuplicateSetPage = (setId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: setMutationKeys.duplicatePage(setId),
    mutationFn: (pageId: string) => duplicateSetPage(setId, pageId),
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
