import type { TStudent } from '@entities/student'
import type React from 'react'

export type TContextMenuItem = {
  id: string
  label: string
  icon?: React.ReactNode
  color?: 'red'
  disabled?: boolean
  onClick: (student: TStudent) => void
}

/**
 * Конфиг контекстного меню для строки таблицы учеников.
 * Разделители между пунктами проставляются автоматически.
 */
export const createStudentContextMenuConfig = (handlers: {
  onOpenShelf: (student: TStudent) => void
  onEditProfile: (student: TStudent) => void
  onDelete: (student: TStudent) => void
}): TContextMenuItem[] => [
  {
    id: 'open-shelf',
    label: 'Открыть полку ученика',
    onClick: handlers.onOpenShelf,
  },
  {
    id: 'edit-profile',
    label: 'Редактировать профиль ученика',
    onClick: handlers.onEditProfile,
  },
  {
    id: 'delete',
    label: 'Удалить',
    color: 'red',
    onClick: handlers.onDelete,
  },
]
