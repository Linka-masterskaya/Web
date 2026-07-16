import type { TStudent } from '../model/student.schema'

export const createStudent = async (data: Omit<TStudent, 'id'>): Promise<TStudent> => {
  const id = `student-${crypto.randomUUID()}`

  console.log(`[API] createStudent — создан ученик ${id}`, data)

  return { id, ...data }
}
