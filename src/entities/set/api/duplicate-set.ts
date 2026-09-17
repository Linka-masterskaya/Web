import { apiClient } from '@shared/lib/api'
import { HTTPError } from 'ky'
import { duplicateSetParamsSchema, type TDuplicateSetParams } from '../model/duplicate-set.schema'
import { setSchema, type TSet } from '../model/set.schema'

const shouldRetryDublicateSet = (error: unknown): boolean => {
  if (!(error instanceof HTTPError) || error.response.status !== 401) {
    return false
  }

  return error.request.headers.get('Authorization')?.startsWith('Bearer ') ?? false
}

export const duplicateSet = async (params: TDuplicateSetParams): Promise<TSet> => {
  const data = duplicateSetParamsSchema.parse(params)

  return apiClient
    .post(`packs/${data.setId}/duplicate`, {
      ...(data.folderId ? { json: { folder_id: data.folderId } } : {}),
      // Запрос неидемпотентный:
      // разрешаем только auth-retry после 401.
      retry: {
        limit: 1,
        methods: ['post'],
        statusCodes: [401],
        shouldRetry: ({ error }) => shouldRetryDublicateSet(error),
      },
    })
    .json(setSchema)
}
