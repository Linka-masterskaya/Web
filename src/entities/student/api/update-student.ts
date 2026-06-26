import type { TStudent } from '../model/student.schema'

export const updateStudent = async (
  id: string,
  data: Partial<Omit<TStudent, 'id'>>,
): Promise<TStudent> => {
  console.log(`[API] updateStudent — обновлён ученик id=${id}`, data)

  return { id, ...data } as TStudent
}
