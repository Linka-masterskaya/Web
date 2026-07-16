import type { TStudent } from '../model/student.schema'

export const deleteStudent = async (student: TStudent): Promise<TStudent> => {
  const archived = { ...student, state: 'archived' as const }

  console.log(`[API] deleteStudent — удален (заархивирован) ученик id=${student.id}`, archived)

  return archived
}
