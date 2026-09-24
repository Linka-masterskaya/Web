import { apiClient } from '@shared/lib/api'
import type { TSection } from '../model/content-item.schema'
import { foldersResponseSchema, type TFoldersResponse } from '../model/folder.schema'

type TGetFoldersParams = {
  section: TSection
  parentId?: string | null
  limit?: number
  offset?: number
}

export const getFolders = async (params: TGetFoldersParams): Promise<TFoldersResponse> => {
  const { section, parentId, limit, offset } = params

  const searchParams: Record<string, string | number> = {
    section,
  }

  if (parentId) {
    searchParams.parent_id = parentId
  }

  if (limit != null) {
    searchParams.limit = limit
  }

  if (offset != null) {
    searchParams.offset = offset
  }

  return apiClient.get('folders', { searchParams }).json(foldersResponseSchema)
}
