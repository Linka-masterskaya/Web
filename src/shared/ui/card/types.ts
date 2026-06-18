import type { ReactElement } from 'react'

export type TCardAction = { type: 'link'; href: string } | { type: 'function'; onClick: () => void }

export type TCardLevel = 'easy' | 'medium' | 'hard'

type TCardIconVariant = {
  variant: 'icon'
  /** Контент для variant="icon", например: <Icon name="Folder" />. Размер иконки задаётся стилями карточки (72px). */
  icon: ReactElement
}

type TCardImageVariant = {
  variant: 'image'
  /** URL изображения для variant="image" */
  imageSrc: string
  /** Обязательный alt для доступности */
  imageAlt: string
}

export type TCardProps = {
  className?: string
  label: string
  level?: TCardLevel
  action: TCardAction
} & (TCardIconVariant | TCardImageVariant)

export type TCardLevelProps = {
  level: TCardLevel
  className?: string
}
