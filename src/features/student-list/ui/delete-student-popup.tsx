import { type TStudent, useDeleteStudent } from '@entities/student'
import { Button, Flex, Text } from '@mantine/core'
import { getApiErrorMessage } from '@shared/lib/api'
import { PopupLayout } from '@shared/ui/popup-layout'
import { useState } from 'react'

type TDeleteStudentPopupProps = {
  student: TStudent
  onClose: () => void
}

export const DeleteStudentPopup: React.FC<TDeleteStudentPopupProps> = ({ student, onClose }) => {
  const { mutateAsync: deleteStudent, isPending } = useDeleteStudent()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      setError(null)
      await deleteStudent(student.id)
      onClose()
    } catch (err) {
      setError(await getApiErrorMessage(err))
    }
  }

  return (
    <PopupLayout title="Удалить ученика" onClose={onClose}>
      <Text size="sm">Ученик «{student.name}» будет удален. Он исчезнет из списка учеников.</Text>

      {error && (
        <Text c="red.6" size="sm">
          {error}
        </Text>
      )}

      <Flex direction="column" gap="xs">
        <Button color="red" onClick={handleDelete} loading={isPending}>
          Удалить
        </Button>
        <Button variant="default" onClick={onClose} disabled={isPending}>
          Отмена
        </Button>
      </Flex>
    </PopupLayout>
  )
}
