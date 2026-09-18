import type { ReactNode } from 'react'

export type TCardGridItem = {
  id: string
  cardType?: 'normal' | 'text' | 'empty' | 'space'
  media?: ReactNode
  ariaLabel?: string
  imageSrc?: string
  title?: string
}

export type TCardGridSize = {
  rows: number
  cols: number
}

type TCardGridBaseProps = {
  title?: string
  size: TCardGridSize
  cards: TCardGridItem[]
  className?: string
  selectedCardId?: string | null
  minRowHeight?: number
}

export type TCardGridProps =
  | (TCardGridBaseProps & {
      mode: 'single'
      value: string
      onChange: (id: string) => void
    })
  | (TCardGridBaseProps & {
      mode: 'multi'
      value: string[]
      onChange: (ids: string[]) => void
    })
  | (TCardGridBaseProps & {
      mode: 'plain' | 'order'
      onCardClick?: (id: string) => void
    })
