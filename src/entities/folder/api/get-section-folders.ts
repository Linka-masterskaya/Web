import { apiClient } from '@shared/lib/api'
import {
  getSectionFoldersParamsSchema,
  sectionFoldersResponseSchema,
  type TGetSectionFoldersParams,
  type TSectionFoldersResponse,
} from '../model/section-folder.schema'

const SECTION_FOLDERS_LIMIT = 100
const SECTION_FOLDERS_OFFSET = 0

/** GET /folders?section= — папки раздела (свои папки, папки учеников, папки Библиотеки) */
export const getSectionFolders = async (
  params: TGetSectionFoldersParams,
): Promise<TSectionFoldersResponse> => {
  const { section } = getSectionFoldersParamsSchema.parse(params)

  return apiClient
    .get('folders', {
      searchParams: { section, limit: SECTION_FOLDERS_LIMIT, offset: SECTION_FOLDERS_OFFSET },
    })
    .json(sectionFoldersResponseSchema)
}
