import { SetSubsetNewPageSkeleton } from './set-subset-new-page.skeleton'

export const lazy = async () => {
  const { SetSubsetNewPage } = await import('./set-subset-new.page')
  return {
    Component: SetSubsetNewPage,
    HydrateFallback: SetSubsetNewPageSkeleton,
  }
}
