import type { TStudentFormValues } from '@entities/student'
import { StudentForm } from '@features/student-form/'
import { Text } from '@mantine/core'
import { PopupLayout } from '@shared/ui/popup-layout'
import type { TStudentEditorProps } from './types'

const TITLES: Record<'create' | 'edit', string> = {
  create: 'Добавление ученика',
  edit: 'Редактирование профиля ученика',
}

export const StudentEditor: React.FC<TStudentEditorProps> = ({
  mode,
  defaultValues,
  avatarSrc,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = async (values: TStudentFormValues) => {
    await onSubmit?.(values)
    onClose?.()
  }

  return (
    <PopupLayout onClose={onClose}>
      <Text ta="center" w="100%" fw={700} mb="md">
        {TITLES[mode]}
      </Text>
      <StudentForm
        defaultValues={defaultValues}
        initialAvatarUrl={avatarSrc}
        submitLabel={mode === 'create' ? 'Добавить ученика' : 'Сохранить изменения'}
        onSubmit={handleSubmit}
      />
    </PopupLayout>
  )
}
