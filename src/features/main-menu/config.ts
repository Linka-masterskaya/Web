import { accessLevel, type TAccessLevel } from '@entities/auth'
import { createUrl, routerPath } from '@shared/lib/routes'

export type TMainMenuItem = {
  id: string
  url: string
  label: string
  end?: boolean
  accessLevel: TAccessLevel
}

export const mainMenuConfig = {
  items: [
    {
      id: 'home',
      url: createUrl(routerPath.dashboard),
      label: 'Dashboard',
      end: true,
      accessLevel: accessLevel.auth,
    },
    {
      id: 'login',
      url: createUrl(routerPath.auth),
      label: 'Login',
      end: true,
      accessLevel: accessLevel.guest,
    },
    {
      id: 'forgot-password',
      url: createUrl(routerPath.authForgotPassword),
      label: 'Forgot Password',
      end: true,
      accessLevel: accessLevel.guest,
    },
  ] satisfies TMainMenuItem[],
} as const
