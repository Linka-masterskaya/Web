import type { TLibraryCategory } from '@entities/library'

export type TLibraryCategoriesProps = {
  categories: TLibraryCategory[]
  selectedCategoryId: string | null
  onSelect: (categoryId: string) => void
}
