import type { TLibraryCard } from '@entities/library'

export type TLibraryCardsProps = {
  cards: TLibraryCard[]
  selectedCards: TLibraryCard[]
  onSelect: (card: TLibraryCard) => void
  /** Карточка, к ряду которой нужно прокрутить сетку (выбор через поиск) */
  scrollToCard?: TLibraryCard | null
}
