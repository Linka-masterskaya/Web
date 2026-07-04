import type { ReactNode } from 'react'

export type TAvatarUploaderProps = {
  /** URL аватара или null, если аватара нет */
  avatarSrc: string | null
  /** Fallback-контент когда нет avatarSrc (инициалы, иконка и т.д.) */
  initials?: ReactNode
  /** Колбэк при выборе нового файла */
  onReplace: (file: File) => void | Promise<void>
  /** Колбэк при удалении аватара */
  onDelete: () => void | Promise<void>
  /** Разрешённые MIME-типы (по умолчанию jpeg/png/webp) */
  acceptedMimeTypes?: readonly string[]
  /** Радиус/скругление аватара (50% — круг, 8px — скруглённые углы и т.д.) */
  radius?: string | number
  /** Кастомный триггер меню (по умолчанию ActionIcon с EllipsisVertical) */
  menuTarget?: ReactNode
  /** Индикатор загрузки */
  isLoading?: boolean
  /** Текст ошибки */
  error?: string | null
}
