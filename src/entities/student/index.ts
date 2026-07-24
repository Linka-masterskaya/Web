export { createStudent } from './api/create-student'
export { deleteStudent } from './api/delete-student'
export { getStudent } from './api/get-student'
export { getStudents } from './api/get-students'
export { updateStudent } from './api/update-student'
export {
  STUDENT_AGE_MAX,
  STUDENT_AGE_MIN,
  STUDENT_CARDS_SHIFT_LABELS,
  STUDENT_CARDS_SHIFT_OPTIONS,
  STUDENT_STATE_LABELS,
  STUDENT_STATE_OPTIONS,
  type TStudentCardsShift,
  type TStudentState,
} from './config'
export { useCreateStudent } from './hooks/use-create-student'
export { useDeleteStudent } from './hooks/use-delete-student'
export { useStudent } from './hooks/use-student'
export { useStudents } from './hooks/use-students'
export { useUpdateStudent } from './hooks/use-update-student'
export { studentQueryKeys } from './lib/query-keys'
export type { TStudent, TStudentFormValues } from './model/student.schema'
export { studentFormDefaultValues, studentSchema } from './model/student.schema'
