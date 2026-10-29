import {
  createSetSectionQuery,
  createUrl,
  routerPath,
  useRouteQueryParams,
} from '@shared/lib/routes'
import { useLocation, useParams } from 'react-router'
import { z } from 'zod'

const idSchema = z.string().uuid()

const toPathname = (url: string) => url.split('?')[0] ?? url

export const useSetStudioRoute = () => {
  const location = useLocation()
  const { queryParams } = useRouteQueryParams()
  const { setId, subsetId } = useParams()
  const parsedSetId = idSchema.safeParse(setId)
  const parsedSubsetId = idSchema.safeParse(subsetId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const sectionQuery = createSetSectionQuery({
    section:
      queryParams.section === 'library' ||
      queryParams.section === 'my' ||
      queryParams.section === 'students'
        ? queryParams.section
        : null,
    folderId: queryParams.folderId,
  })

  const setOverviewUrl = parsedSetId.success
    ? createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }, sectionQuery)
    : null
  const setEditorUrl = parsedSetId.success
    ? createUrl(routerPath.dashboardSetIdEdit, { setId: resolvedSetId }, sectionQuery)
    : null
  const subsetEditorUrl =
    parsedSetId.success && parsedSubsetId.success
      ? createUrl(
          routerPath.dashboardSubsetIdEdit,
          {
            setId: resolvedSetId,
            subsetId: parsedSubsetId.data,
          },
          sectionQuery,
        )
      : null

  const subsetPreviewUrl =
    parsedSetId.success && parsedSubsetId.success
      ? createUrl(
          routerPath.dashboardSubsetId,
          {
            setId: resolvedSetId,
            subsetId: parsedSubsetId.data,
          },
          sectionQuery,
        )
      : null

  const subsetNewUrl = parsedSetId.success
    ? createUrl(routerPath.dashboardSubsetNew, { setId: resolvedSetId }, sectionQuery)
    : null

  const pathname = location.pathname

  return {
    hasValidSetId: parsedSetId.success,
    hasValidSubsetId: parsedSubsetId.success,
    resolvedSetId,
    resolvedSubsetId: parsedSubsetId.success ? parsedSubsetId.data : '',
    setOverviewUrl,
    isSetOverview: setOverviewUrl != null && pathname === toPathname(setOverviewUrl),
    isSetEditor: setEditorUrl != null && pathname === toPathname(setEditorUrl),
    isSubsetEditor: subsetEditorUrl != null && pathname === toPathname(subsetEditorUrl),
    isSubsetNew: subsetNewUrl != null && pathname === toPathname(subsetNewUrl),
    isEditorRoute:
      (setEditorUrl != null && pathname === toPathname(setEditorUrl)) ||
      (subsetEditorUrl != null && pathname === toPathname(subsetEditorUrl)) ||
      (subsetNewUrl != null && pathname === toPathname(subsetNewUrl)),
    subsetEditorUrl,
    isSubsetPreview: subsetPreviewUrl != null && pathname === toPathname(subsetPreviewUrl),
  }
}
