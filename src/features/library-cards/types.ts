import type { TLibraryCard } from '@entities/library'

export type TLibraryCardsProps = {
  cards: TLibraryCard[]
  selectedCards: TLibraryCard[]
  onSelect: (card: TLibraryCard) => void
}
