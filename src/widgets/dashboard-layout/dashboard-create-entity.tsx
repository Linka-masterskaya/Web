import type { TCreateEntityConfig } from '@features/create-entity'
import { CreateEntity } from '@features/create-entity'
import { useOpenCreateFolder } from '@features/create-folder'
import { useOpenCreateSet } from '@features/create-set'
import { createUrl, routerPath, useRouteQueryParams } from '@shared/lib/routes'
import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { z } from 'zod'

const folderIdSchema = z.string().uuid()
const setsPagePath = createUrl(routerPath.dashboardSets)

export const DashboardCreateEntity: React.FC = () => {
  const location = useLocation()
  const openCreateSet = useOpenCreateSet()
  const openCreateFolder = useOpenCreateFolder()
  const { queryParams } = useRouteQueryParams()
  const folderIdParam = queryParams.folderId

  const folderId = useMemo(() => {
    const parsed = folderIdSchema.safeParse(folderIdParam ?? undefined)

    return parsed.success ? parsed.data : null
  }, [folderIdParam])

  const isSetsListPage = location.pathname === setsPagePath

  const config = useMemo((): TCreateEntityConfig | null => {
    if (!isSetsListPage) {
      return null
    }

    if (folderId) {
      return {
        actions: [
          {
            label: 'Создать набор',
            icon: 'Grid3x3',
            onClick: () => openCreateSet({ folderId }),
          },
        ],
      }
    }

    return {
      actions: [
        {
          label: 'Создать папку',
          icon: 'Folder',
          onClick: () => openCreateFolder({ section: 'my', parentId: null }),
        },
      ],
    }
  }, [folderId, isSetsListPage, openCreateFolder, openCreateSet])

  if (!config) {
    return null
  }

  return <CreateEntity config={config} />
}
