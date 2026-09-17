import { duplicateSet, type TSet } from '@entities/set'
import { copySetToFoldersParamsSchema, type TCopySetToFoldersParams } from './copy-set.schema'

const COPY_CONCURRENCY = 4

export type TCopySetSuccess = {
  folderId: string
  set: TSet
}

export type TCopySetFailure = {
  folderId: string
  error: unknown
}

export type TCopySetReport = {
  successes: TCopySetSuccess[]
  failures: TCopySetFailure[]
}

export const copySetToFolders = async (
  params: TCopySetToFoldersParams,
): Promise<TCopySetReport> => {
  const data = copySetToFoldersParamsSchema.parse(params)

  const successes: TCopySetSuccess[] = []
  const failures: TCopySetFailure[] = []

  for (let startIndex = 0; startIndex < data.folderIds.length; startIndex += COPY_CONCURRENCY) {
    const folderIdsChunk = data.folderIds.slice(startIndex, startIndex + COPY_CONCURRENCY)

    const chunkResults = await Promise.all(
      folderIdsChunk.map(async (folderId) => {
        try {
          const createdSet = await duplicateSet({
            setId: data.setId,
            folderId,
          })

          return {
            success: true as const,
            folderId,
            set: createdSet,
          }
        } catch (error: unknown) {
          return {
            success: false as const,
            folderId,
            error,
          }
        }
      }),
    )

    for (const result of chunkResults) {
      if (result.success) {
        successes.push({
          folderId: result.folderId,
          set: result.set,
        })
      } else {
        failures.push({
          folderId: result.folderId,
          error: result.error,
        })
      }
    }
  }

  return {
    successes,
    failures,
  }
}
