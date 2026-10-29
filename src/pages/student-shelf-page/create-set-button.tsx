import { useStudentFolder } from '@entities/folder'
import { useOpenCreateSet } from '@features/create-set'
import { Button } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { useParams } from 'react-router'

/** Кнопка «+ Создать» в панели полки ученика */
export const CreateSetButton: React.FC = () => {
  const { id: studentId } = useParams<{ id: string }>()
  const { folderId } = useStudentFolder(studentId)
  const openCreateSet = useOpenCreateSet()

  const handleClick = () => {
    if (!folderId) {
      return
    }

    openCreateSet({
      folderId,
      studentId,
    })
  }

  return (
    <Button
      leftSection={<Icon name="Grid3x3" size={20} />}
      onClick={handleClick}
      disabled={!folderId}
    >
      Создать набор
    </Button>
  )
}
