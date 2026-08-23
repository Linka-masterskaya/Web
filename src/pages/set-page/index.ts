import { SetPageSkeleton } from './set-page.skeleton'

export const lazy = async () => {
  const { SetPage } = await import('./set.page')
  return {
    Component: SetPage,
    HydrateFallback: SetPageSkeleton,
  }
}
