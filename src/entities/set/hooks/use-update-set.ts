import { folderQueryKeys } from '@entities/folder'
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
          ageMin: params.ageMin,
          ageMax: params.ageMax,
          difficulty: params.difficulty,
          goals: params.goals,
          notes: params.notes,
        }
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: setQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: folderQueryKeys.all }),
      ])
    },
  })
}
