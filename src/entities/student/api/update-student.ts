import { apiClient } from '@shared/lib/api'
import { studentSchema, type TStudent } from '../model/student.schema'

export const updateStudent = async (
  id: string,
  data: Partial<Omit<TStudent, 'id'>>,
): Promise<TStudent> => {
  const updated = await apiClient.patch(`students/${id}`, { json: data }).json(studentSchema)

  return updated
}
