import type { TStudent } from '@entities/student'
import type { TContextMenuItem } from '@shared/ui/context-menu/types'

type TContextMenuItemStudent = {
  onEditProfile: (student: TStudent) => void
  onDelete: (student: TStudent) => void
}

/**
 * Конфиг контекстного меню для строки таблицы учеников.
 * Разделители между пунктами проставляются автоматически.
 */
export const createStudentContextMenuConfig = ({
  onEditProfile,
  onDelete,
}: TContextMenuItemStudent): TContextMenuItem<TStudent>[] => [
  {
    id: 'edit-profile',
    label: 'Редактировать профиль ученика',
    onClick: (student) => {
      onEditProfile(student)
    },
  },
  {
    id: 'delete',
    label: 'Удалить',
    color: 'red',
    onClick: (student) => {
      onDelete(student)
    },
  },
]
