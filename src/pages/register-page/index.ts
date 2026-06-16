import { RegisterPageSkeleton } from './register-page.skeleton'

export const lazy = async () => {
  const { RegisterPage } = await import('./register.page')
  return {
    Component: RegisterPage,
    HydrateFallback: RegisterPageSkeleton,
  }
}
