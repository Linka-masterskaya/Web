import { Button } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { Icon } from '@shared/ui/icon'
import { useCallback } from 'react'
import { StudentEditorModal } from './student-editor-modal'

/** Кнопка «Добавить ученика» — в панели хлебных крошек раздела */
export const AddStudentButton: React.FC = () => {
  const { open, close } = useModal()

  const handleCreate = useCallback(() => {
    open({
      content: <StudentEditorModal mode="create" onClose={close} />,
      size: 'md',
      // У контента свой крестик (PopupLayout) — дублирующий скрываем
      withCloseButton: false,
      // fade без transform: иначе SegmentedControl меряет индикатор во время
      // анимации открытия (pop) и активный пункт «прилипает» к левому краю
      transitionProps: { transition: 'fade' },
    })
  }, [open, close])

  return (
    <Button leftSection={<Icon name="Plus" size={16} />} onClick={handleCreate}>
      Добавить ученика
    </Button>
  )
}
