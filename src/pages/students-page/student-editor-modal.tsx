import { uploadMedia } from '@entities/media'
import {
  type TStudent,
  type TStudentCreateInput,
  type TStudentFormValues,
  useCreateStudent,
  useUpdateStudent,
} from '@entities/student'
import type { TStudentFormSubmitMeta } from '@features/student-form'
import { getApiErrorMessage } from '@shared/lib/api'
import { StudentEditor } from '@widgets/student-editor'
import { useCallback, useState } from 'react'

type TStudentEditorModalProps = {
  mode: 'create' | 'edit'
  student?: TStudent
  onClose: () => void
}

type TStudentPayload = TStudentCreateInput & {
  avatar_media_id?: string | null
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
    async (values: TStudentFormValues, meta: TStudentFormSubmitMeta) => {
      const payload: TStudentPayload = {
        name: values.name,
        email: values.email,
        age: values.age,
        status: values.status,
      }

      try {
        setError(null)

        // Аватар: выбран файл → грузим в /media и шлём avatar_media_id;
        // удалён → avatar_media_id: null; не тронут → поле не отправляем
        if (values.avatarFile) {
          const media = await uploadMedia(values.avatarFile)
          payload.avatar_media_id = media.id
        } else if (mode === 'edit' && meta.avatarRemoved) {
          payload.avatar_media_id = null
        }

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
      avatarSrc={student?.avatar_url ?? student?.avatarSrc ?? null}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  )
}
