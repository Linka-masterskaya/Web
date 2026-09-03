import { uploadMedia } from '@entities/media'
import {
  STUDENT_AGE_MIN,
  type TStudent,
  type TStudentCreateInput,
  type TStudentFormValues,
  useCreateStudent,
  useUpdateStudent,
} from '@entities/student'
import type { TStudentFormSubmitMeta } from '@features/student-form'
import { getApiErrorMessage } from '@shared/lib/api'
import { StudentEditor } from '@widgets/student-editor'
import { useCallback, useMemo, useState } from 'react'

type TStudentEditorModalProps = {
  mode: 'create' | 'edit'
  student?: TStudent
  onClose: () => void
}

type TStudentPayload = TStudentCreateInput

export const StudentEditorModal: React.FC<TStudentEditorModalProps> = ({
  mode,
  student,
  onClose,
}) => {
  const { mutateAsync: createStudent } = useCreateStudent()
  const { mutateAsync: updateStudent } = useUpdateStudent()
  const [error, setError] = useState<string | null>(null)

  const formDefaultValues = useMemo<Partial<TStudentFormValues> | undefined>(() => {
    if (!student) {
      return undefined
    }

    return {
      name: student.name,
      email: student.email,
      age: student.age ?? STUDENT_AGE_MIN,
      status: student.status,
      cardsShift: student.cards_shift,
      avatarFile: null,
    }
  }, [student])

  const handleSubmit = useCallback(
    async (values: TStudentFormValues, meta: TStudentFormSubmitMeta) => {
      const payload: TStudentPayload = {
        name: values.name,
        email: values.email,
        age: values.age,
        status: values.status,
        cards_shift: values.cardsShift,
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
      defaultValues={formDefaultValues}
      avatarSrc={student?.avatar_url ?? null}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  )
}
