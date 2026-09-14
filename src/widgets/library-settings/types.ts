import type { TLibraryCard, TLibraryPictureImport } from '@entities/library'

export type TLibrarySettingsProps = {
  onSelect: (cards: TLibraryCard[], imports: TLibraryPictureImport[]) => void
}
