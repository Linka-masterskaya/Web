import { getIsAuth, useAuthStore } from '@entities/auth'
import { createUrl, routerPath } from '@shared/lib/routes'
import { redirect } from 'react-router'

export const requireAuthLoader = async () => {
  if (!getIsAuth()) {
    throw redirect(createUrl(routerPath.login))
  }

  const { accessToken, refreshAccessToken } = useAuthStore.getState()

  // Refresh only when auth exists but token is missing (e.g. after app reload)
  if (!accessToken) {
    await refreshAccessToken()
  }

  return null
}
