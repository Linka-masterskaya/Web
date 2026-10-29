import { type TSectionFolder, useSectionFolders } from '@entities/folder'
import { useRouteQueryParams } from '@shared/lib/routes'
import { BreadCrumbs, type TBreadCrumbItem } from '@shared/ui/bread-crumbs'
import { useLocation } from 'react-router'
import { z } from 'zod'
import { dashboardRootLabel, dashboardRootPath, dashboardSectionRoutes } from './dashboard-sections'

const folderIdSchema = z.string().uuid()

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
  const currentSection = dashboardSectionRoutes.find((section) =>
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
      label: dashboardRootLabel,
      href: dashboardRootPath,
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
