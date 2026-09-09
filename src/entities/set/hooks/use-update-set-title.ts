import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSetTitle } from '../api/update-set-title'
import { mergeSet } from '../lib/merge-set'
import { setMutationKeys, setQueryKeys } from '../lib/query-keys'
import type { TSet } from '../model/set.schema'

export const useUpdateSetTitle = (setId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: setMutationKeys.updateTitle(setId),
    mutationFn: (title: string) => updateSetTitle({ setId, title }),
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: setQueryKeys.detail(setId) })

      const previousSet = queryClient.getQueryData<TSet>(setQueryKeys.detail(setId))

      queryClient.setQueryData<TSet>(setQueryKeys.detail(setId), (set) =>
        set ? { ...set, title: title.trim() } : set,
      )

      return { previousSet }
    },
    onError: (_error, _title, context) => {
      if (context?.previousSet) {
        queryClient.setQueryData(setQueryKeys.detail(setId), context.previousSet)
      }
    },
    onSuccess: async (set) => {
      queryClient.setQueryData<TSet>(setQueryKeys.detail(setId), (currentSet) =>
        mergeSet(currentSet, set),
      )

      await queryClient.invalidateQueries({ queryKey: setQueryKeys.lists() })
    },
  })
}
