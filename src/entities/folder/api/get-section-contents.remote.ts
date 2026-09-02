import { apiClient } from '@shared/lib/api'
import {
  getSectionContentsParamsSchema,
  sectionContentsResponseSchema,
  type TGetSectionContentsParams,
  type TSectionContentsResponse,
} from '../model/content-item.schema'

/** GET /sections/{section}/contents — папки и наборы узла дерева. Фильтры: search, age, difficulty. */
export const getSectionContentsRemote = async (
  params: TGetSectionContentsParams,
): Promise<TSectionContentsResponse> => {
  const { section, parentId, limit, offset, sort, order, search, age, difficulty } =
    getSectionContentsParamsSchema.parse(params)

  const searchParams: Record<string, string | number> = {}

  if (parentId) {
    searchParams.parent_id = parentId
  }

  if (limit != null) {
    searchParams.limit = limit
  }

  if (offset != null) {
    searchParams.offset = offset
  }

  if (sort) {
    searchParams.sort = sort
  }

  if (order) {
    searchParams.order = order
  }

  if (search) {
    searchParams.search = search
  }

  if (age != null) {
    searchParams.age = age
  }

  if (difficulty) {
    searchParams.difficulty = difficulty
  }

  return apiClient
    .get(`sections/${section}/contents`, { searchParams })
    .json(sectionContentsResponseSchema)
}
