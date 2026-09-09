import { SetEditPageSkeleton } from './set-edit-page.skeleton'

export const lazy = async () => {
  const { SetEditPage } = await import('./set-edit.page')

  return {
    Component: SetEditPage,
    HydrateFallback: SetEditPageSkeleton,
  }
}
