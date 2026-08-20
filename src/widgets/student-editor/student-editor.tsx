import type { TStudentFormValues } from '@entities/student'
import type { TStudentFormSubmitMeta } from '@features/student-form'
import { StudentForm } from '@features/student-form/'
import { Button, Text } from '@mantine/core'
import { PopupLayout } from '@shared/ui/popup-layout'
import type { TStudentEditorProps } from './types'

const TITLES: Record<'create' | 'edit', string> = {
  create: 'Новый ученик',
  edit: 'Редактировать ученика',
}

export const StudentEditor: React.FC<TStudentEditorProps> = ({
  mode,
  defaultValues,
  avatarSrc,
  error,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = async (values: TStudentFormValues, meta: TStudentFormSubmitMeta) => {
    await onSubmit?.(values, meta)
    onClose?.()
  }

  return (
    <PopupLayout title={TITLES[mode]} onClose={onClose}>
      {error && (
        <Text c="red.6" size="sm">
          {error}
        </Text>
      )}
      <StudentForm
        defaultValues={defaultValues}
        initialAvatarUrl={avatarSrc}
        onSubmit={handleSubmit}
      />
      {onClose && (
        <Button variant="default" onClick={onClose} fullWidth mt="xs">
          Отмена
        </Button>
      )}
    </PopupLayout>
  )
}
