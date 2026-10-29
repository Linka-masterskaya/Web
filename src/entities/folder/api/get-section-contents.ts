import { apiClient } from '@shared/lib/api'
import {
  getSectionContentsParamsSchema,
  sectionContentsResponseSchema,
  type TGetSectionContentsParams,
  type TSectionContentsResponse,
} from '../model/content-item.schema'

/** GET /sections/{section}/contents — папки и наборы узла дерева. Фильтры: query, age, difficulty, is_favorite. */
export const getSectionContents = async (
  params: TGetSectionContentsParams,
): Promise<TSectionContentsResponse> => {
  const { section, parentId, limit, offset, sort, order, query, age, difficulty, isFavorite } =
    getSectionContentsParamsSchema.parse(params)

  const searchParams: Record<string, string | number | boolean> = {}

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

  if (query) {
    searchParams.query = query
  }

  if (age != null) {
    searchParams.age = age
  }

  if (difficulty) {
    searchParams.difficulty = difficulty
  }

  if (isFavorite) {
    searchParams.is_favorite = true
  }

  return apiClient
    .get(`sections/${section}/contents`, { searchParams })
    .json(sectionContentsResponseSchema)
}
