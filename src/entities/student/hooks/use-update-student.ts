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
      console.log(`[Cache] useUpdateStudent — обновление кеша id=${updated.id}`)

      queryClient.setQueryData<TStudent>(studentQueryKeys.detail(updated.id), updated)

      queryClient.setQueryData<TStudent[]>(studentQueryKeys.list(), (old) =>
        old?.map((s) => (s.id === updated.id ? updated : s)),
      )
    },
  })
}
