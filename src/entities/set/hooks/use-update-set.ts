import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSet } from '../api/update-set'
import { mergeSet } from '../lib/merge-set'
import { setMutationKeys, setQueryKeys } from '../lib/query-keys'
import type { TSet } from '../model/set.schema'

export const useUpdateSet = (setId = '') => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: setMutationKeys.updateSettings(setId),
    mutationFn: updateSet,
    onSuccess: async (updatedSet, params) => {
      queryClient.setQueryData<TSet>(setQueryKeys.detail(updatedSet.id), (currentSet) => {
        const mergedSet = mergeSet(currentSet, updatedSet)

        return {
          ...mergedSet,
          age: params.age,
          difficulty: params.difficulty,
          goals: params.goals,
          notes: params.notes ?? undefined,
        }
      })

      await queryClient.invalidateQueries({ queryKey: setQueryKeys.lists() })
    },
  })
}
