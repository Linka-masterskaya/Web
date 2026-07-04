import type { TStudent } from '../model/student.schema'
import { getStudent } from './get-student'

export const updateStudent = async (
  id: string,
  data: Partial<Omit<TStudent, 'id'>>,
): Promise<TStudent> => {
  console.log(`[API] updateStudent — обновлён ученик id=${id}`, data)

  const existing = await getStudent(id)
  const updated = { ...existing, ...data }

  return updated
}
