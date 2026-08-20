import {
  type TStudent,
  type TStudentFormValues,
  useCreateStudent,
  useUpdateStudent,
} from '@entities/student'
import { getApiErrorMessage } from '@shared/lib/api'
import { StudentEditor } from '@widgets/student-editor'
import { useCallback, useState } from 'react'

type TStudentEditorModalProps = {
  mode: 'create' | 'edit'
  student?: TStudent
  onClose: () => void
}

export const StudentEditorModal: React.FC<TStudentEditorModalProps> = ({
  mode,
  student,
  onClose,
}) => {
  const { mutateAsync: createStudent } = useCreateStudent()
  const { mutateAsync: updateStudent } = useUpdateStudent()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (values: TStudentFormValues) => {
      const { avatarFile: _avatarFile, ...payload } = values

      try {
        setError(null)

        if (mode === 'create') {
          await createStudent(payload)
        } else if (student) {
          await updateStudent({ id: student.id, data: payload })
        }

        onClose()
      } catch (err) {
        setError(await getApiErrorMessage(err))
      }
    },
    [mode, student, createStudent, updateStudent, onClose],
  )

  return (
    <StudentEditor
      mode={mode}
      defaultValues={student}
      avatarSrc={student?.avatarSrc ?? null}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  )
}
