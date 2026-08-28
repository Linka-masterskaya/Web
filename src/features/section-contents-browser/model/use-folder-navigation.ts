import type { TFolderContentItem } from '@entities/section-content'
import { useCallback, useState } from 'react'

// минимальная информация о папке, которая нужна для возврата назад и возможно для breadcrumbs
export type TFolderPathItem = Pick<TFolderContentItem, 'id' | 'name'>

// хук не выполняет HTTP-запросы, он вычисляет id текущей папки
// useSectionContents реагирует на изменение id и подгружает новые данные
export const useFolderNavigation = () => {
  const [folderPath, setFolderPath] = useState<TFolderPathItem[]>([])

  const currentFolder = folderPath[folderPath.length - 1]

  const openFolder = useCallback((folder: TFolderContentItem) => {
    setFolderPath((currentPath) => {
      const lastFolder = currentPath[currentPath.length - 1]

      if (lastFolder?.id === folder.id) {
        return currentPath
      }

      return [
        ...currentPath,
        {
          id: folder.id,
          name: folder.name,
        },
      ]
    })
  }, [])

  // возвращает на один уровень выше
  const goBack = useCallback(() => {
    setFolderPath((currentPath) => currentPath.slice(0, -1))
  }, [])

  // возвращает к корню раздела
  const goToRoot = useCallback(() => {
    setFolderPath([])
  }, [])

  const goToFolder = useCallback((folderIndex: number) => {
    setFolderPath((currentPath) => currentPath.slice(0, folderIndex + 1))
  }, [])

  return {
    folderPath,
    currentFolder,
    currentFolderId: currentFolder?.id,
    isRoot: folderPath.length === 0,
    openFolder,
    goBack,
    goToRoot,
    goToFolder,
  }
}
