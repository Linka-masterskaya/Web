import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStudent } from '../api/create-student'
import { studentQueryKeys } from '../lib/query-keys'
import type { TStudent } from '../model/student.schema'

export const useCreateStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStudent,
    onSuccess: (newStudent) => {
      console.log('[Cache] useCreateStudent — инвалидация списка учеников')

      queryClient.setQueryData<TStudent[]>(studentQueryKeys.list(), (old) =>
        old ? [...old, newStudent] : [newStudent],
      )

      queryClient.invalidateQueries({ queryKey: studentQueryKeys.list() })
    },
  })
}
