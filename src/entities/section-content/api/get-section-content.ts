import { apiClient } from '@shared/lib/api'

import type { TGetSectionContentParams, TSectionContentResponse } from '../model/types'

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

const buildSectionContentSearchParams = ({
  parentId, // для корня не добавляется, а для вложенной папки равен id открытой папки
  sort = 'name',
  order = 'asc',
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
}: TGetSectionContentParams): URLSearchParams => {
  const searchParams = new URLSearchParams({
    sort,
    order,
    limit: String(limit),
    offset: String(offset),
  })

  if (parentId) {
    searchParams.set('parent_id', parentId)
  }

  return searchParams
}

export const getSectionContents = async (
  params: TGetSectionContentParams,
): Promise<TSectionContentResponse> => {
  const searchParams = buildSectionContentSearchParams(params)

  return apiClient
    .get(`section/${params.section}/contents`, {
      searchParams,
      signal: params.signal,
    })
    .json<TSectionContentResponse>()
}
