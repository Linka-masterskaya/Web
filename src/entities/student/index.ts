export { createStudent } from './api/create-student'
export { deleteStudent } from './api/delete-student'
export { getStudent } from './api/get-student'
export { getStudents } from './api/get-students'
export { updateStudent } from './api/update-student'
export {
  STUDENT_AGE_MAX,
  STUDENT_AGE_MIN,
  STUDENT_LEVEL_LABELS,
  STUDENT_LEVEL_OPTIONS,
  STUDENT_STATE_LABELS,
  STUDENT_STATE_OPTIONS,
  type TStudentLevel,
  type TStudentState,
} from './config'
export { useCreateStudent } from './hooks/use-create-student'
export { useDeleteStudent } from './hooks/use-delete-student'
export { useStudent } from './hooks/use-student'
export { useStudents } from './hooks/use-students'
export { useUpdateStudent } from './hooks/use-update-student'
export { studentQueryKeys } from './lib/query-keys'
export { studentSchema, type TStudent } from './model/student.schema'
