import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSetPageStructure } from '../api/update-set-page-structure'
import { setMutationKeys, setQueryKeys } from '../lib/query-keys'
import type { TUpdateSetPageStructureParams } from '../model/update-set-page-structure.schema'

export const useUpdateSetPageStructure = (setId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: setMutationKeys.updatePageStructure(setId),
    mutationFn: (params: TUpdateSetPageStructureParams) => updateSetPageStructure(setId, params),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: setQueryKeys.detail(setId) })
    },
    onSuccess: (set) => {
      queryClient.setQueryData(setQueryKeys.detail(setId), set)
    },
  })
}
