import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteStudent } from '../api/delete-student'
import { studentQueryKeys } from '../lib/query-keys'
import type { TStudent } from '../model/student.schema'

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: (archived) => {
      queryClient.setQueryData<TStudent>(studentQueryKeys.detail(archived.id), archived)

      queryClient.setQueryData<TStudent[]>(studentQueryKeys.list(), (old) =>
        old?.map((s) => (s.id === archived.id ? archived : s)),
      )
    },
  })
}
