import { type TSection, type TSectionFolder, useSectionFolders } from '@entities/folder'
import {
  createDashboardLibraryUrl,
  createDashboardSetsUrl,
  createUrl,
  routerPath,
  useRouteQueryParams,
} from '@shared/lib/routes'
import { BreadCrumbs, type TBreadCrumbItem } from '@shared/ui/bread-crumbs'
import { useLocation } from 'react-router'
import { z } from 'zod'

const dashboardUrl = createUrl(routerPath.dashboard)
const folderIdSchema = z.string().uuid()

const createStudentsSectionUrl = (folderId?: string | null) => {
  const parsed = folderIdSchema.safeParse(folderId ?? undefined)

  return createUrl(
    routerPath.dashboardStudents,
    undefined,
    parsed.success ? { folderId: parsed.data } : undefined,
  )
}

const dashboardBreadcrumbSections = [
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

const isCurrentSectionPath = (pathname: string, sectionPath: string) => pathname === sectionPath

/** Цепочка от корня раздела до текущей папки по parent_id. */
const buildFolderTrail = (
  folders: readonly TSectionFolder[],
  folderId: string | undefined,
): TSectionFolder[] => {
  if (!folderId) {
    return []
  }

  const byId = new Map(folders.map((folder) => [folder.id, folder]))
  const trail: TSectionFolder[] = []
  let currentId: string | null = folderId
  const seen = new Set<string>()

  while (currentId && !seen.has(currentId)) {
    seen.add(currentId)
    const folder = byId.get(currentId)
    if (!folder) {
      break
    }
    trail.unshift(folder)
    currentId = folder.parentId
  }

  return trail
}

export const DashboardBreadcrumbs: React.FC = () => {
  const { pathname } = useLocation()
  const { queryParams } = useRouteQueryParams()
  const currentSection = dashboardBreadcrumbSections.find((section) =>
    isCurrentSectionPath(pathname, section.path),
  )

  const parsedFolderId = folderIdSchema.safeParse(queryParams.folderId ?? undefined)
  const folderId = parsedFolderId.success ? parsedFolderId.data : undefined

  const foldersQuery = useSectionFolders(currentSection?.section ?? 'my', {
    enabled: Boolean(currentSection),
  })
  const folderTrail =
    currentSection && foldersQuery.data ? buildFolderTrail(foldersQuery.data, folderId) : []

  const items: TBreadCrumbItem[] = [
    {
      id: 'dashboard',
      label: 'Главная',
      href: dashboardUrl,
    },
  ]

  if (currentSection) {
    items.push({
      id: currentSection.path,
      label: currentSection.label,
      href: currentSection.createFolderUrl(null),
    })

    for (const folder of folderTrail) {
      items.push({
        id: folder.id,
        label: folder.name || 'Папка',
        href: currentSection.createFolderUrl(folder.id),
      })
    }
  }

  return <BreadCrumbs items={items} />
}
