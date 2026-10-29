import { LoginPageSkeleton } from './login-page.skeleton'

export const lazy = async () => {
  const { LoginPage } = await import('./login.page')
  return {
    Component: LoginPage,
    HydrateFallback: LoginPageSkeleton,
  }
}
