import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteStudent } from '../api/delete-student'
import { studentQueryKeys } from '../lib/query-keys'

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.all })
    },
  })
}
