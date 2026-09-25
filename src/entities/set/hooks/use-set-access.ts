import { useSectionFolders } from '@entities/folder'
import type { TSection } from '@entities/section-content'
import { isHeadDefectologist, useUserStore } from '@entities/user'
import {
  createDashboardLibraryUrl,
  createDashboardSetsUrl,
  createSetSectionQuery,
  useRouteQueryParams,
} from '@shared/lib/routes'
import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { z } from 'zod'

export type TSetLocationState = {
  section?: TSection
  folderId?: string
}

const folderIdSchema = z.string().uuid()

const parseSection = (value: string | null | undefined): TSection | null => {
  if (value === 'library' || value === 'my' || value === 'students') {
    return value
  }

  return null
}

const parseFolderId = (value: string | null | undefined): string | null => {
  const parsed = folderIdSchema.safeParse(value ?? undefined)
  return parsed.success ? parsed.data : null
}

/**
 * Контекст набора в студии: откуда открыли (раздел + папка) и куда вести «Назад».
 * Источник истины — query (?section=&folderId=); location.state — запасной вариант.
 */
export const useSetAccess = (packFolderId?: string | null) => {
  const role = useUserStore((state) => state.role)
  const location = useLocation()
  const { queryParams } = useRouteQueryParams()
  const locationState = location.state as TSetLocationState | null
  const sectionFromState = parseSection(locationState?.section)
  const sectionFromQuery = parseSection(queryParams.section)
  const libraryFoldersQuery = useSectionFolders('library')
  const myFoldersQuery = useSectionFolders('my')

  const packFolder = parseFolderId(packFolderId)
  const browsingFolderId =
    parseFolderId(queryParams.folderId) ?? parseFolderId(locationState?.folderId) ?? null

  const isLibraryByFolder = Boolean(
    packFolder && libraryFoldersQuery.data?.some((folder) => folder.id === packFolder),
  )
  const isMyByFolder = Boolean(
    packFolder && myFoldersQuery.data?.some((folder) => folder.id === packFolder),
  )

  /** Откуда открыли набор — явный query/state, без эвристик по folder_id пакета. */
  const sectionHint = sectionFromQuery ?? sectionFromState

  const isLibrarySet =
    sectionHint === 'library' || (sectionHint == null && isLibraryByFolder && !isMyByFolder)

  const canEditSet = !isLibrarySet || isHeadDefectologist(role)

  /**
   * Папка для «Назад»: куда пользователь смотрел в списке.
   * Не подменяем folder_id пакета, если контекста нет — лучше корень раздела.
   */
  const backFolderId = browsingFolderId

  const backUrl =
    sectionHint === 'library'
      ? createDashboardLibraryUrl(backFolderId)
      : createDashboardSetsUrl(
          // Без явного раздела: не тащим library folder_id в «Мои наборы».
          sectionHint === 'my'
            ? backFolderId
            : isLibraryByFolder && !isMyByFolder
              ? null
              : (backFolderId ?? packFolder),
        )

  const section: TSection | null =
    sectionHint === 'library' || sectionHint === 'my' || sectionHint === 'students'
      ? sectionHint
      : null

  const navigationQuery = useMemo(
    () => createSetSectionQuery({ section, folderId: backFolderId }),
    [section, backFolderId],
  )

  const isAccessResolved =
    sectionHint != null ||
    !packFolder ||
    (libraryFoldersQuery.isFetched && myFoldersQuery.isFetched)

  return {
    isLibrarySet,
    canEditSet,
    backUrl,
    section,
    /** Папка списка, из которой открыли набор (для прокидывания в query). */
    folderId: backFolderId,
    navigationQuery,
    isAccessResolved,
  }
}
