// TODO: временно для отладки #68 - посмотреть как будет при интеграции задач 67 и 68.

import {
  type TStudent,
  type TStudentFormValues,
  useCreateStudent,
  useStudent,
  useUpdateStudent,
} from '@entities/student'
import { Button, Group, Stack, Text } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { StudentEditor } from '@widgets/student-editor'

const STUDENT_EDITOR_MODAL_OPTIONS = {
  withCloseButton: false,
  radius: 20,
  size: 'calc(440px + 2 * var(--mantine-spacing-xxl))',
  transitionProps: {
    transition: 'fade',
    duration: 120,
  },
} as const

const TEST_EDIT_STUDENT_ID = 'student-2'
const mapStudentToFormDefaults = (student: TStudent): Partial<TStudentFormValues> => ({
  name: student.name,
  email: student.email,
  age: student.age,
  state: student.state,
  cardsShift: student.cardsShift,
})

// TODO: пока нет бекенда для загрузки файлов, используем эту функцию для отладки.
const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'))
    reader.readAsDataURL(file)
  })

export const StudentsPage = () => {
  const { open, close } = useModal()
  const createStudentMutation = useCreateStudent()
  const updateStudentMutation = useUpdateStudent()
  const { data: editableStudent, isLoading: isStudentLoading } = useStudent(TEST_EDIT_STUDENT_ID)

  const handleOpenCreate = () => {
    open({
      ...STUDENT_EDITOR_MODAL_OPTIONS,
      content: (
        <StudentEditor
          mode="create"
          onSubmit={async (values) => {
            const avatarSrc = values.avatarFile ? await fileToDataUrl(values.avatarFile) : undefined

            await createStudentMutation.mutateAsync({
              name: values.name,
              email: values.email,
              age: values.age,
              state: values.state,
              cardsShift: values.cardsShift,
              avatarSrc,
            })
          }}
          onClose={close}
        />
      ),
    })
  }

  const handleOpenEdit = () => {
    if (!editableStudent) {
      return
    }
    open({
      ...STUDENT_EDITOR_MODAL_OPTIONS,
      content: (
        <StudentEditor
          mode="edit"
          defaultValues={mapStudentToFormDefaults(editableStudent)}
          avatarSrc={editableStudent.avatarSrc ?? null}
          onSubmit={async (values, meta) => {
            const avatarPatch = values.avatarFile
              ? { avatarSrc: await fileToDataUrl(values.avatarFile) }
              : meta.avatarRemoved
                ? { avatarSrc: undefined } // Удалить аватар
                : {} // Оставить аватар

            await updateStudentMutation.mutateAsync({
              id: editableStudent.id,
              data: {
                name: values.name,
                email: values.email,
                age: values.age,
                state: values.state,
                cardsShift: values.cardsShift,
                ...avatarPatch,
              },
            })
          }}
          onClose={close}
        />
      ),
    })
  }

  return (
    <Stack>
      <Text c="dimmed">Временная страница для отладки #68</Text>
      <Group>
        <Button onClick={handleOpenCreate} loading={createStudentMutation.isPending}>
          Создать ученика
        </Button>
        <Button
          variant="default"
          onClick={handleOpenEdit}
          disabled={!editableStudent || isStudentLoading}
          loading={updateStudentMutation.isPending}
        >
          Редактировать профиль
        </Button>
      </Group>
    </Stack>
  )
}
