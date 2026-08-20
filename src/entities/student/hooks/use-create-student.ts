import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStudent } from '../api/create-student'
import { studentQueryKeys } from '../lib/query-keys'

export const useCreateStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.all })
    },
  })
}
