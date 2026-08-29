import type { TFolderContentItem } from '@entities/section-content'
import { useRouteQueryParams } from '@shared/lib/routes'
import { useCallback, useState } from 'react'
import { z } from 'zod'

// минимальная информация о папке, которая нужна для возврата назад и возможно для breadcrumbs
export type TFolderPathItem = Pick<TFolderContentItem, 'id' | 'name'>

const folderIdSchema = z.string().uuid()

// хук не выполняет HTTP-запросы, он вычисляет id текущей папки
// useSectionContents реагирует на изменение id и подгружает новые данные
export const useFolderNavigation = () => {
  const { queryParams, setQueryParams } = useRouteQueryParams()
  const [openedFolder, setOpenedFolder] = useState<TFolderPathItem | null>(null)
  const parsedFolderId = folderIdSchema.safeParse(queryParams.folderId ?? undefined)
  const currentFolderId = parsedFolderId.success ? parsedFolderId.data : undefined
  const currentFolder = openedFolder?.id === currentFolderId ? openedFolder : undefined
  const folderPath = currentFolder ? [currentFolder] : []

  const openFolder = useCallback(
    (folder: TFolderContentItem) => {
      setOpenedFolder({ id: folder.id, name: folder.name })
      setQueryParams({ folderId: folder.id }, false)
    },
    [setQueryParams],
  )

  // возвращает на один уровень выше
  const goBack = useCallback(() => {
    setOpenedFolder(null)
    setQueryParams({ folderId: null }, false)
  }, [setQueryParams])

  // возвращает к корню раздела
  const goToRoot = useCallback(() => {
    setOpenedFolder(null)
    setQueryParams({ folderId: null }, false)
  }, [setQueryParams])

  const goToFolder = useCallback(
    (folderIndex: number) => {
      if (folderIndex < 0) {
        setOpenedFolder(null)
        setQueryParams({ folderId: null }, false)
      }
    },
    [setQueryParams],
  )

  return {
    folderPath,
    currentFolder,
    currentFolderId,
    isRoot: currentFolderId == null,
    openFolder,
    goBack,
    goToRoot,
    goToFolder,
  }
}
