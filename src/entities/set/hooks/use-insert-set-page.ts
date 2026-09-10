import { useMutation, useQueryClient } from '@tanstack/react-query'
import { insertSetPage } from '../api/insert-set-page'
import { mergeSet } from '../lib/merge-set'
import { setMutationKeys, setQueryKeys } from '../lib/query-keys'
import type { TInsertSetPageParams } from '../model/insert-set-page.schema'
import type { TSet } from '../model/set.schema'

export const useInsertSetPage = (setId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: setMutationKeys.insertPage(setId),
    mutationFn: (params: TInsertSetPageParams) => insertSetPage(setId, params),
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
