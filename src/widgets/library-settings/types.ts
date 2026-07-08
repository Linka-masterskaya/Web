import type { TLibraryCard } from '@entities/library'

export type TLibrarySettingsProps = {
  onSelect: (cards: TLibraryCard[]) => void
}
