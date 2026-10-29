import { SetsPageSkeleton } from './sets-page.skeleton'

export const lazy = async () => {
  const { SetsPage } = await import('./sets.page')
  return {
    Component: SetsPage,
    HydrateFallback: SetsPageSkeleton,
  }
}
