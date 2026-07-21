import type { TLibraryCategory } from '@entities/library'

export type TLibraryCategoriesProps = {
  categories: TLibraryCategory[]
  selectedCategoryId: number | null
  onSelect: (categoryId: number) => void
}
