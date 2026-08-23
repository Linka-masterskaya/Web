import { apiClient } from '@shared/lib/api'
import {
  createFolderParamsSchema,
  createFolderResponseSchema,
  type TCreateFolderParams,
  type TCreateFolderResponse,
} from '../model/create-folder.schema'

/** POST /folders — создать папку в разделе. */
export const createFolder = async (
  params: TCreateFolderParams,
): Promise<TCreateFolderResponse> => {
  const data = createFolderParamsSchema.parse(params)

  return apiClient
    .post('folders', {
      json: {
        name: data.name,
        section: data.section,
        kind: data.kind,
        parent_id: data.parentId ?? null,
      },
    })
    .json(createFolderResponseSchema)
}
