import { getIsAuth, useAuthStore } from '@entities/auth'
import { createUrl, routerPath } from '@shared/lib/routes'
import { redirect } from 'react-router'

export const requireAuthLoader = async () => {
  if (!getIsAuth()) {
    useAuthStore.getState().logout()
    throw redirect(createUrl(routerPath.auth))
  }

  return null
}
