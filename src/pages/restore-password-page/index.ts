import { RestorePasswordPageSkeleton } from './restore-password-page.skeleton'

export const lazy = async () => {
  const { RestorePasswordPage } = await import('./restore-password.page')
  return {
    Component: RestorePasswordPage,
    HydrateFallback: RestorePasswordPageSkeleton,
  }
}
