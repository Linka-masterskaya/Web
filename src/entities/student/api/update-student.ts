import { apiClient } from '@shared/lib/api'
import { studentSchema, type TStudent, type TStudentUpdateInput } from '../model/student.schema'

export const updateStudent = async (id: string, data: TStudentUpdateInput): Promise<TStudent> => {
  const updated = await apiClient.patch(`students/${id}`, { json: data }).json(studentSchema)

  return updated
}
