import { ProfilePageSkeleton } from './profile-page.skeleton'

export const lazy = async () => {
  const { ProfilePage } = await import('./profile.page')
  return {
    Component: ProfilePage,
    HydrateFallback: ProfilePageSkeleton,
  }
}
