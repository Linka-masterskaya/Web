import type { TStudent } from '@entities/student'
import { StudentList } from '@features/student-list'
import { ViewToggle } from '@features/view-toggle'
import { Button, Flex, Group } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { useCallback } from 'react'
import { StudentEditorModal } from './student-editor-modal'

export const StudentsPage: React.FC = () => {
  const { open, close } = useModal()

  const handleCreateStudent = useCallback(() => {
    open({
      content: <StudentEditorModal mode="create" onClose={close} />,
      size: 'md',
      // У контента свой крестик (PopupLayout) — дублирующий скрываем
      withCloseButton: false,
    })
  }, [open, close])

  const handleEditStudent = useCallback(
    (student: TStudent) => {
      open({
        content: <StudentEditorModal mode="edit" student={student} onClose={close} />,
        size: 'md',
        withCloseButton: false,
      })
    },
    [open, close],
  )

  return (
    <Flex direction="column" gap="md">
      <Group justify="flex-end">
        <ViewToggle />
        <Button onClick={handleCreateStudent}>Добавить ученика</Button>
      </Group>

      <StudentList onCreateStudent={handleCreateStudent} onEditStudent={handleEditStudent} />
    </Flex>
  )
}
