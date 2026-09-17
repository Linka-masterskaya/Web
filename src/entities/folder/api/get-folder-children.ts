import { apiClient } from '@shared/lib/api'

import {
  folderTreeItemsResponseSchema,
  getFolderChildrenParamsSchema,
  type TFolderTreeItemsResponse,
  type TGetFolderChildrenParams,
} from '../model/folder-tree.schema'

const FOLDER_PAGE_SIZE = 100

type TGetFolderChildrenRequest = TGetFolderChildrenParams & {
  signal?: AbortSignal
}

export const getFolderChildren = async ({
  signal,
  ...params
}: TGetFolderChildrenRequest): Promise<TFolderTreeItemsResponse> => {
  const { section, parentId } = getFolderChildrenParamsSchema.parse(params)
  const result: TFolderTreeItemsResponse = []

  for (let offset = 0; ; offset += FOLDER_PAGE_SIZE) {
    const searchParams: Record<string, string | number> = {
      section,
      limit: FOLDER_PAGE_SIZE,
      offset,
    }

    if (parentId != null) {
      searchParams.parent_id = parentId
    }

    const page = await apiClient
      .get('folders', {
        searchParams,
        signal,
      })
      .json(folderTreeItemsResponseSchema)

    result.push(...page)

    if (page.length < FOLDER_PAGE_SIZE) {
      return result
    }
  }
}
