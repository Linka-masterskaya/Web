import { NotFoundPageSkeleton } from './not-found-page.skeleton'

export const lazy = async () => {
  const { NotFoundPage } = await import('./not-found.page')
  return {
    Component: NotFoundPage,
    HydrateFallback: NotFoundPageSkeleton,
  }
}
