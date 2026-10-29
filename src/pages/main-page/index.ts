import { MainPageSkeleton } from './main-page.skeleton'

export const lazy = async () => {
  const { MainPage } = await import('./main.page')
  return {
    Component: MainPage,
    HydrateFallback: MainPageSkeleton,
  }
}
