import type { TSection } from '@entities/folder'
import {
  createDashboardLibraryUrl,
  createDashboardSetsUrl,
  createUrl,
  routerPath,
} from '@shared/lib/routes'
import { z } from 'zod'

const folderIdSchema = z.string().uuid()

/** Ссылка на раздел «Картотека учеников» с учётом активной папки. */
export const createStudentsSectionUrl = (folderId?: string | null) => {
  const parsed = folderIdSchema.safeParse(folderId ?? undefined)

  return createUrl(
    routerPath.dashboardStudents,
    undefined,
    parsed.success ? { folderId: parsed.data } : undefined,
  )
}

/** Корень дашборда: используется и в крошках, и в заголовке хедера. */
export const dashboardRootPath = createUrl(routerPath.dashboard)
export const dashboardRootLabel = 'Главная'

/**
 * Разделы дашборда. Подпись раздела (`label`) — единый источник и для хлебных
 * крошек, и для заголовка хедера, чтобы они не расходились.
 */
export const dashboardSectionRoutes = [
  {
    section: 'library' as const satisfies TSection,
    path: createUrl(routerPath.dashboardLibrary),
    label: 'Библиотека',
    createFolderUrl: createDashboardLibraryUrl,
  },
  {
    section: 'students' as const satisfies TSection,
    path: createUrl(routerPath.dashboardStudents),
    label: 'Картотека учеников',
    createFolderUrl: createStudentsSectionUrl,
  },
  {
    section: 'my' as const satisfies TSection,
    path: createUrl(routerPath.dashboardSets),
    label: 'Мои наборы',
    createFolderUrl: createDashboardSetsUrl,
  },
] as const

/** Раздел по текущему пути. Совпадение точное — как в крошках. */
export const findDashboardSectionByPath = (pathname: string) =>
  dashboardSectionRoutes.find((section) => section.path === pathname)
