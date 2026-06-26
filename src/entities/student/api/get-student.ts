import { studentSchema, type TStudent } from '../model/student.schema'
import { getStudents } from './get-students'

export const getStudent = async (id: string): Promise<TStudent> => {
  console.log(`[API] getStudent — запрос ученика id=${id}`)
  const students = await getStudents()
  const student = students.find((s) => s.id === id)

  if (!student) {
    throw new Error(`Ученик с id "${id}" не найден`)
  }

  return studentSchema.parse(student)
}
