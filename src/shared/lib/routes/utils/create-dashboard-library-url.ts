import { z } from 'zod'
import { routerPath } from '../config'
import { createUrl } from './create-url'

const folderIdSchema = z.string().uuid()

export const createDashboardLibraryUrl = (folderId?: string | null) => {
  const parsed = folderIdSchema.safeParse(folderId ?? undefined)

  return createUrl(
    routerPath.dashboardLibrary,
    undefined,
    parsed.success ? { folderId: parsed.data } : undefined,
  )
}
