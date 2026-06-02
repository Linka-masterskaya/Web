import { getIsAuth } from '@entities/auth'
import { createUrl, routerPath } from '@shared/lib/routes'
import { redirect } from 'react-router'

export const rootRedirectLoader = () =>
  redirect(createUrl(getIsAuth() ? routerPath.dashboard : routerPath.login))
