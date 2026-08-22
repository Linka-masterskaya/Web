import { ResendVerificationPageSkeleton } from './resend-verification-page.skeleton'

export const lazy = async () => {
  const { ResendVerificationPage } = await import('./resend-verification.page')

  return {
    Component: ResendVerificationPage,
    HydrateFallback: ResendVerificationPageSkeleton,
  }
}
