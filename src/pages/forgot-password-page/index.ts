import { ForgotPasswordPageSkeleton } from './forgot-password-page.skeleton'

export const lazy = async () => {
  const { ForgotPasswordPage } = await import('./forgot-password.page')
  return {
    Component: ForgotPasswordPage,
    HydrateFallback: ForgotPasswordPageSkeleton,
  }
}
