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
  onEditProfile: (student: TStudent) => void
  onDelete: (student: TStudent) => void
}): TContextMenuItem[] => [
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
