import { VerifyEmailPageSkeleton } from './verify-email-page.skeleton'

export const lazy = async () => {
  const { VerifyEmailPage } = await import('./verify-email.page')

  return {
    Component: VerifyEmailPage,
    HydrateFallback: VerifyEmailPageSkeleton,
  }
}
