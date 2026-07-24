import type { TStudentFormValues } from '@entities/student'
import type { TStudentFormSubmitMeta } from '@features/student-form'
import { StudentForm } from '@features/student-form/'
import { Stack, Title } from '@mantine/core'
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
  const handleSubmit = async (values: TStudentFormValues, meta: TStudentFormSubmitMeta) => {
    await onSubmit?.(values, meta)
    onClose?.()
  }

  return (
    <PopupLayout onClose={onClose} contentGap={0}>
      <Stack px="xl" pb="xl" gap={0}>
        <Title order={2} ta="center" mb="xxl">
          {TITLES[mode]}
        </Title>
        <StudentForm
          defaultValues={defaultValues}
          initialAvatarUrl={avatarSrc}
          submitLabel={mode === 'create' ? 'Добавить ученика' : 'Сохранить изменения'}
          onSubmit={handleSubmit}
        />
      </Stack>
    </PopupLayout>
  )
}
