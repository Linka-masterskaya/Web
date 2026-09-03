import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStudent } from '../api/update-student'
import { studentQueryKeys } from '../lib/query-keys'
import type { TStudent, TStudentUpdateInput } from '../model/student.schema'

export const useUpdateStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TStudentUpdateInput }) =>
      updateStudent(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<TStudent>(studentQueryKeys.detail(updated.id), updated)

      queryClient.invalidateQueries({ queryKey: studentQueryKeys.all })
    },
  })
}
