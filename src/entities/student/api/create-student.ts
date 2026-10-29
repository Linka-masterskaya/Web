import { apiClient } from '@shared/lib/api'
import { studentSchema, type TStudent, type TStudentCreateInput } from '../model/student.schema'

export const createStudent = async (data: TStudentCreateInput): Promise<TStudent> => {
  const created = await apiClient.post('students', { json: data }).json(studentSchema)

  return created
}
