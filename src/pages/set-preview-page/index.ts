import { SetPreviewPageSkeleton } from './set-preview-page.skeleton'

export const lazy = async () => {
  const { SetPreviewPage } = await import('./set-preview.page')

  return {
    Component: SetPreviewPage,
    HydrateFallback: SetPreviewPageSkeleton,
  }
}
