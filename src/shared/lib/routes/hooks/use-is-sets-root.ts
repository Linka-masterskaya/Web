import { useLocation } from 'react-router'
import { z } from 'zod'
import { routerPath } from '../config'
import { createUrl } from '../utils/create-url'
import { useRouteQueryParams } from './use-route-query-params'

const folderIdSchema = z.string().uuid()
const setsPagePath = createUrl(routerPath.dashboardSets)

/** Корень «Мои наборы»: /dashboard/sets без folderId — там только папки, без фильтров наборов. */
export const useIsSetsRoot = (): boolean => {
  const { pathname } = useLocation()
  const { queryParams } = useRouteQueryParams()

  if (pathname !== setsPagePath) {
    return false
  }

  return !folderIdSchema.safeParse(queryParams.folderId ?? undefined).success
}
