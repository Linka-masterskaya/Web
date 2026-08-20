import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStudent } from '../api/update-student'
import { studentQueryKeys } from '../lib/query-keys'
import type { TStudent } from '../model/student.schema'

export const useUpdateStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<TStudent, 'id'>> }) =>
      updateStudent(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<TStudent>(studentQueryKeys.detail(updated.id), updated)

      queryClient.invalidateQueries({ queryKey: studentQueryKeys.all })
    },
  })
}
