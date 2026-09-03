import { createUrl, routerPath } from '@shared/lib/routes'
import { useLocation, useParams } from 'react-router'
import { z } from 'zod'

const idSchema = z.string().uuid()

export const useSetStudioRoute = () => {
  const location = useLocation()
  const { setId, subsetId } = useParams()
  const parsedSetId = idSchema.safeParse(setId)
  const parsedSubsetId = idSchema.safeParse(subsetId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const setOverviewUrl = parsedSetId.success
    ? createUrl(routerPath.dashboardSetId, { setId: resolvedSetId })
    : null
  const setEditorUrl = parsedSetId.success
    ? createUrl(routerPath.dashboardSetIdEdit, { setId: resolvedSetId })
    : null
  const subsetEditorUrl =
    parsedSetId.success && parsedSubsetId.success
      ? createUrl(routerPath.dashboardSubsetIdEdit, {
          setId: resolvedSetId,
          subsetId: parsedSubsetId.data,
        })
      : null

  return {
    hasValidSetId: parsedSetId.success,
    resolvedSetId,
    setOverviewUrl,
    isSetOverview: location.pathname === setOverviewUrl,
    isEditorRoute: location.pathname === setEditorUrl || location.pathname === subsetEditorUrl,
  }
}
