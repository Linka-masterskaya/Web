import { useSectionFolders } from '@entities/folder'
import type { TSection } from '@entities/section-content'
import { isHeadDefectologist, useUserStore } from '@entities/user'
import {
  createDashboardLibraryUrl,
  createDashboardSetsUrl,
  useRouteQueryParams,
} from '@shared/lib/routes'
import { useLocation } from 'react-router'

export type TSetLocationState = {
  section?: TSection
  folderId?: string
}

const parseSection = (value: string | null | undefined): TSection | null => {
  if (value === 'library' || value === 'my' || value === 'students') {
    return value
  }

  return null
}

/** Доступ к набору: библиотечные наборы редактирует только главный методист. */
export const useSetAccess = (folderId?: string | null) => {
  const role = useUserStore((state) => state.role)
  const location = useLocation()
  const { queryParams } = useRouteQueryParams()
  const locationState = location.state as TSetLocationState | null
  const sectionFromState = parseSection(locationState?.section)
  const sectionFromQuery = parseSection(queryParams.section)
  const libraryFoldersQuery = useSectionFolders('library')
  const myFoldersQuery = useSectionFolders('my')

  const resolvedFolderId = folderId ?? locationState?.folderId ?? null

  const isLibraryByFolder = Boolean(
    resolvedFolderId && libraryFoldersQuery.data?.some((folder) => folder.id === resolvedFolderId),
  )
  const isMyByFolder = Boolean(
    resolvedFolderId && myFoldersQuery.data?.some((folder) => folder.id === resolvedFolderId),
  )

  /** Откуда открыли набор — только явный query/state, без эвристик по folderId. */
  const sectionHint = sectionFromQuery ?? sectionFromState

  const isLibrarySet =
    sectionHint === 'library' || (sectionHint == null && isLibraryByFolder && !isMyByFolder)

  const canEditSet = !isLibrarySet || isHeadDefectologist(role)

  // Назад: в Библиотеку только если открыли оттуда; иначе всегда «Мои наборы».
  const backUrl =
    sectionHint === 'library'
      ? createDashboardLibraryUrl(locationState?.folderId ?? resolvedFolderId)
      : createDashboardSetsUrl(
          // folderId из Библиотеки в /sets даёт 404 — не подставляем.
          isLibraryByFolder && !isMyByFolder ? null : resolvedFolderId,
        )

  const isAccessResolved =
    sectionHint != null ||
    !resolvedFolderId ||
    (libraryFoldersQuery.isFetched && myFoldersQuery.isFetched)

  return {
    isLibrarySet,
    canEditSet,
    backUrl,
    /** В URL студии пишем только явный раздел (чтобы «Назад» не уезжал в library по ошибке). */
    section: sectionHint === 'library' || sectionHint === 'my' ? sectionHint : null,
    isAccessResolved,
  }
}
