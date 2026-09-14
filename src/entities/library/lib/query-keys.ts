export const libraryQueryKeys = {
  all: ['library'] as const,
  categories: () => [...libraryQueryKeys.all, 'categories'] as const,
  cards: (categoryId: string) => [...libraryQueryKeys.all, 'cards', categoryId] as const,
  cardSearch: (query: string) => [...libraryQueryKeys.all, 'card-search', query] as const,
  pictureContent: (pictureId: string) =>
    [...libraryQueryKeys.all, 'picture-content', pictureId] as const,
}
