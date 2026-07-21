import type { TLibraryCard } from '@entities/library'

export type TLibrarySearchProps = {
  /** Вызывается при выборе подсказки из выпадающего списка */
  onSelect: (card: TLibraryCard) => void
  className?: string
}
