export const libraryQueryKeys = {
  all: ['library'] as const,
  categories: () => [...libraryQueryKeys.all, 'categories'] as const,
  cards: (categoryId: number) => [...libraryQueryKeys.all, 'cards', categoryId] as const,
  cardSearch: (query: string) => [...libraryQueryKeys.all, 'card-search', query] as const,
}
