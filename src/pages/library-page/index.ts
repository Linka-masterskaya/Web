import { LibraryPageSkeleton } from './library-page.skeleton'

export const lazy = async () => {
  const { LibraryPage } = await import('./library.page')
  return {
    Component: LibraryPage,
    HydrateFallback: LibraryPageSkeleton,
  }
}
