import type { TLibraryCard, TLibraryPictureImport } from '@entities/library'

export type TLibrarySettingsProps = {
  onSelect: (cards: TLibraryCard[], imports: TLibraryPictureImport[]) => void | Promise<void>
  /**
   * Только выбор карточки без POST /pictures/:id/import.
   * Нужен для обложки набора: в списке обложка читается как library picture id.
   */
  selectionOnly?: boolean
}
