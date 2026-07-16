import type { TStudentFormValues } from '@entities/student'
import { StudentForm } from '@features/student-form/'
import { Button } from '@mantine/core'
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
  onClose,
  onSubmit,
}) => {
  const handleSubmit = async (values: TStudentFormValues) => {
    await onSubmit?.(values)
    onClose?.()
  }

  return (
    <PopupLayout title={TITLES[mode]} onClose={onClose}>
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
