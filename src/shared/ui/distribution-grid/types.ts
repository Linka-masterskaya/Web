import type { ReactNode } from 'react'

/** Карточка распределения: стандартная карточка, как во всех типах заданий. */
export type TDistributionGridItem = {
  id: string
  cardType?: 'normal' | 'text' | 'empty' | 'space'
  media?: ReactNode
  ariaLabel?: string
  imageSrc?: string
  title?: string
}

/** Колонка распределения: карточка сверху и карточки вариантов под ней. */
export type TDistributionGridCategory = {
  id: string
  /** Шапка колонки — полноценная карточка. */
  header: TDistributionGridItem
  /** Варианты под шапкой (мишка). */
  items: TDistributionGridItem[]
}

export type TDistributionGridProps = {
  className?: string
  categories: TDistributionGridCategory[]
  elementCount: number
  /** Какая карточка выбрана: шапка или вариант. `null` — ничего. */
  selectedCardId?: string | null
  /** Клик по любой карточке колонки, в том числе по шапке. */
  onCardClick?: (id: string) => void
}
