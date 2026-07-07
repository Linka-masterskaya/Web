import { StudentAvatar } from '@features/student-avatar'
import { Button, Flex, Group, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { useState } from 'react'
import type { TStudentEditorProps } from './types'

const FORM_ID = 'student-editor-form'

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
  const [currentAvatarSrc, setCurrentAvatarSrc] = useState<string | null>(avatarSrc ?? null)

  const handleAvatarChange = (file: File) => {
    const url = URL.createObjectURL(file)
    setCurrentAvatarSrc(url)
  }

  const handleSubmit = async (values: TStudentFormValues) => {
    await onSubmit?.(values)
    onClose?.()
  }

  return (
    <Flex direction="column" gap="lg">
      <Flex justify="space-between" align="center">
        <Title order={3}>{TITLES[mode]}</Title>
        {onClose && (
          <Button
            variant="subtle"
            color="gray"
            size="compact-sm"
            onClick={onClose}
            aria-label="Закрыть"
            px={4}
          >
            <Icon name="X" size={20} />
          </Button>
        )}
      </Flex>

      <Flex justify="center">
        <StudentAvatar avatarSrc={currentAvatarSrc} onChange={handleAvatarChange} />
      </Flex>

      <StudentForm id={FORM_ID} defaultValues={defaultValues} onSubmit={handleSubmit} />

      <Group justify="flex-end" gap="sm">
        {onClose && (
          <Button variant="outline" color="gray" onClick={onClose}>
            Отмена
          </Button>
        )}
        <Button type="submit" form={FORM_ID}>
          Сохранить
        </Button>
      </Group>
    </Flex>
  )
}
