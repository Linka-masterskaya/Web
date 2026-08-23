import type { TStudent } from '../model/student.schema'

export const deleteStudent = async (student: TStudent): Promise<TStudent> => {
  const archived = { ...student, state: 'archived' as const }

  return archived
}
