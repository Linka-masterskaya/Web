import { getIsAuth } from '@entities/auth'
import { createUrl, routerPath } from '@shared/lib/routes'
import { redirect } from 'react-router'

export const requireGuestLoader = () => {
  if (getIsAuth()) {
    throw redirect(createUrl(routerPath.dashboard))
  }

  return null
}
