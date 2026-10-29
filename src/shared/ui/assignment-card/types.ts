import type { ReactNode } from 'react'

export type TCardGridCardProps = {
  cardType?: 'normal' | 'text' | 'empty' | 'space'
  media?: ReactNode
  ariaLabel?: string
  imageSrc?: string
  title?: string
  active?: boolean
  indicator?: TCardGridCardIndicator
  onClick?: () => void
}

export type TCardGridCardIndicator =
  | {
      type: 'check'
      selected: boolean
      selectedActive?: boolean
    }
  | {
      type: 'order'
      value: number
    }
