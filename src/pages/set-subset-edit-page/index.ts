import { SetSubsetEditPageSkeleton } from './set-subset-edit-page.skeleton'

export const lazy = async () => {
  const { SetSubsetEditPage } = await import('./set-subset-edit.page')
  return {
    Component: SetSubsetEditPage,
    HydrateFallback: SetSubsetEditPageSkeleton,
  }
}
