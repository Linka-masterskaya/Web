import { useQuery } from '@tanstack/react-query'
import { getStudent } from '../api/get-student'
import { studentQueryKeys } from '../lib/query-keys'

export const useStudent = (id: string) =>
  useQuery({
    queryKey: studentQueryKeys.detail(id),
    queryFn: () => getStudent(id),
    enabled: id.length > 0,
  })
