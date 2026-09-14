import type { TLibraryCard } from '@entities/library'

export type TLibraryCardsProps = {
  cards: TLibraryCard[]
  selectedCards: TLibraryCard[]
  onSelect: (card: TLibraryCard) => void
  scrollToCard?: TLibraryCard | null
}

export type TLibraryCardThumbnailProps = {
  card: TLibraryCard
  isSelected: boolean
  onSelect: (card: TLibraryCard) => void
}
