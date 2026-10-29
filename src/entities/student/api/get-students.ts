import { apiClient } from '@shared/lib/api'
import { studentsListResponseSchema, type TStudent } from '../model/student.schema'

export const getStudents = async (): Promise<TStudent[]> => {
  const data = await apiClient.get('students').json(studentsListResponseSchema)

  return data.items
}
