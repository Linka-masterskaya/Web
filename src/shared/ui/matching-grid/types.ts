import type { ReactNode } from 'react'

export type TMatchingGridItem = {
  id: string
  cardType: 'normal' | 'text' | 'empty' | 'space'
  title?: string
  media?: ReactNode
  imageSrc?: string
  ariaLabel?: string
}

export type TMatchingPair = {
  leftId: string
  rightId: string
}

export type TMatchingGridProps = {
  className?: string
  elements: TMatchingGridItem[]
  pairs: TMatchingPair[]
  selectedCardId?: string | null
  onSelect?: (id: string) => void
}
