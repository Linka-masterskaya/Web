import type { TFolderContentItem } from '@entities/section-content'
import { useRouteQueryParams } from '@shared/lib/routes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { z } from 'zod'

const folderIdSchema = z.string().uuid()

export type TFolderPathItem = Pick<TFolderContentItem, 'id' | 'name'>

const parseFolderIdParam = (value: string | null): string | undefined => {
  const parsed = folderIdSchema.safeParse(value ?? undefined)

  return parsed.success ? parsed.data : undefined
}

export const useFolderNavigation = () => {
  const { queryParams, setQueryParams } = useRouteQueryParams()
  const folderIdParam = queryParams.folderId
  const currentFolderId = parseFolderIdParam(folderIdParam)

  const folderNamesRef = useRef(new Map<string, string>())
  const [folderPath, setFolderPath] = useState<TFolderPathItem[]>([])

  useEffect(() => {
    if (folderIdParam && !currentFolderId) {
      setQueryParams({ folderId: null }, false, { replace: true })
    }
  }, [currentFolderId, folderIdParam, setQueryParams])

  useEffect(() => {
    setFolderPath((currentPath) => {
      if (!currentFolderId) {
        return []
      }

      const existingIndex = currentPath.findIndex((folder) => folder.id === currentFolderId)

      if (existingIndex >= 0) {
        return currentPath.slice(0, existingIndex + 1)
      }

      return [
        ...currentPath,
        {
          id: currentFolderId,
          name: folderNamesRef.current.get(currentFolderId) ?? '',
        },
      ]
    })
  }, [currentFolderId])

  const currentFolder = folderPath[folderPath.length - 1]

  const openFolder = useCallback(
    (folder: TFolderContentItem) => {
      if (folder.id === currentFolderId) {
        return
      }

      folderNamesRef.current.set(folder.id, folder.name)
      setQueryParams({ folderId: folder.id })
    },
    [currentFolderId, setQueryParams],
  )

  const goBack = useCallback(() => {
    const parentFolder = folderPath[folderPath.length - 2]

    setQueryParams({ folderId: parentFolder?.id ?? null })
  }, [folderPath, setQueryParams])

  const goToRoot = useCallback(() => {
    setQueryParams({ folderId: null })
  }, [setQueryParams])

  const goToFolder = useCallback(
    (folderIndex: number) => {
      const folder = folderPath[folderIndex]

      setQueryParams({ folderId: folder?.id ?? null })
    },
    [folderPath, setQueryParams],
  )

  return {
    folderPath,
    currentFolder,
    currentFolderId,
    isRoot: currentFolderId === undefined,
    openFolder,
    goBack,
    goToRoot,
    goToFolder,
  }
}
