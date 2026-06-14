import type { ReactNode } from 'react'

export type TCardAction = { type: 'link'; href: string } | { type: 'function'; onClick: () => void }

export type TCardLevel = 'easy' | 'medium' | 'hard'

export type TCardProps = {
  className?: string
  variant: 'icon' | 'image'
  label: string
  level?: TCardLevel
  action: TCardAction
  /** Контент для variant="icon", например: <Folder /> из lucide-react. Размер иконки задаётся стилями карточки (72px). */
  icon?: ReactNode
  /** URL изображения для variant="image" */
  imageSrc?: string
  imageAlt?: string
}

export type TCardLevelProps = {
  level: TCardLevel
  className?: string
}
