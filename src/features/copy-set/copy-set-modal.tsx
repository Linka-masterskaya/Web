import styles from ''
import { type TFolderTreeItem, useFolderChildren } from '@entities/folder'
import { HTTPError } from 'ky'
import { type FormEvent, useMemo, useState } from 'react'
import type { TCopySetTargetSection } from './copy-set.schema'
import type { TCopySetModalProps } from './types'
import { useCopySetToFolders } from './use-copy-set-to-folders'

type TSelectedFolder = {
  id: string
  name: string
  pathLabel: string
}

type TCopyFeedback = {
  type: 'warning' | 'error'
  message: string
}

const ROOT_LABELS: Record<TCopySetTargetSection, string> = {
  my: 'Мои наборы',
  students: 'Картотека учеников',
}

const EMPTY_FOLDERS: TFolderTreeItem[] = []

const getCopyErrorMessage = (error: unknown): string => {
  if (error instanceof HTTPError) {
    switch (error.response.status) {
      case 400:
        return 'Выбрана неккоректная папка назначения'
      case 401:
        return 'Не удалось подтвердить авторизацию'
      case 403:
        return 'У вас нет доступа к выбранной папке'
      case 404:
        return 'Набор или папка назначения не найдены'
      default:
        return `Не удалось создать копию. Код ошибки: ${error.response.status}`
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось создать копию набора'
}

export const CopySetModal: React.FC<TCopySetModalProps> = ({
  setId,
  setName,
  targetSection,
  className,
  onClose,
  onSuccess,
}) => {
  const copySetMutation = useCopySetToFolders()

  const [path, setPath] = useState<TFolderTreeItem[]>([])

  const [selectedFolders, setSelectedFolders] = useState<TSelectedFolder[]>([])

  const [search, setSearch] = useState('')
  const [feedback, setFeedback] = useState<TCopyFeedback | null>(null)

  const rootLabel = ROOT_LABELS[targetSection]
  const currentFolder = path[path.length - 1] ?? null
  const currentParentId = currentFolder?.id ?? null
  const folderQuery = useFolderChildren({
    section: targetSection,
    parentId: currentParentId,
  })

  const selectedFolderIds = useMemo(
    () => new Set(selectedFolders.map((folder) => folder.id)),
    [selectedFolders],
  )

  const visibleFolders = useMemo(() => {
    const folders = folderQuery.data ?? EMPTY_FOLDERS
    const normalizedSearch = search.trim().toLocaleLowerCase('ru')

    const filteredFolders =
      normalizedSearch.length === 0
        ? folders
        : folders.filter((folder) => folder.name.toLocaleLowerCase('ru').includes(normalizedSearch))

    return [...filteredFolders].sort((firstFolder, secondFolder) =>
      firstFolder.name.localeCompare(secondFolder.name, 'ru'),
    )
  }, [folderQuery.data, search])

  const currentPathLabel = [rootLabel, ...path.map((folder) => folder.name)].join(' / ')

  const currentFolderOption: TSelectedFolder | null = currentFolder
    ? {
        id: currentFolder.id,
        name: currentFolder.name,
        pathLabel: currentPathLabel,
      }
    : null
  const resetOperationState = () => {
    setFeedback(null)
    copySetMutation.reset()
  }

  const createSelectedFolder = (folder: TFolderTreeItem): TSelectedFolder => ({
    id: folder.id,
    name: folder.name,
    pathLabel: [rootLabel, ...path.map((pathFolder) => pathFolder.name), folder.name].join(' / '),
  })

  const handleToggleFolder = (folder: TSelectedFolder) => {
    resetOperationState()

    setSelectedFolders((currentFolders) => {
      const isSelected = currentFolders.some(
        (currentFolderItem) => currentFolderItem.id === folder.id,
      )

      if (isSelected) {
        return currentFolders.filter((currentFolderItem) => currentFolderItem.id !== folder.id)
      }

      return [...currentFolders, folder]
    })
  }

  const handleOpenFolder = (folder: TFolderTreeItem) => {
    setPath((currentPath) => [...currentPath, folder])
    setSearch('')
    resetOperationState()
  }

  const handleGoBack = () => {
    if (path.length === 0) {
      return
    }

    setPath((currentPath) => currentPath.slice(0, -1))
    setSearch('')
    resetOperationState()
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value)

    resetOperationState()
  }

  const handleClose = () => {
    if (copySetMutation.isPending) {
      return
    }

    onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (selectedFolders.length === 0 || copySetMutation.isPending) {
      return
    }

    setFeedback(null)

    try {
      const report = await copySetMutation.mutateAsync({
        setId,
        folderIds: selectedFolders.map((folder) => folder.id),
      })

      if (report.failures.length === 0) {
        onSuccess?.()
        onClose()
        return
      }

      const firstFailureMessage = getCopyErrorMessage(report.failures[0]?.error)

      if (report.successes.length === 0) {
        setFeedback({
          type: 'error',
          message: firstFailureMessage,
        })

        return
      }

      const failedFolderIds = new Set(report.failures.map((failure) => failure.folderId))

      setSelectedFolders((currentFolders) =>
        currentFolders.filter((folder) => failedFolderIds.has(folder.id)),
      )

      setFeedback({
        type: 'warning',
        message: [
          `Создано копий: ${report.successes.length}`,
          `Не удалось: ${report.failures.length}`,
          firstFailureMessage,
        ].join(' '),
      })
    } catch (error: unknown) {
      setFeedback({
        type: 'error',
        message: getCopyErrorMessage(error),
      })
    }
  }

  const handleClearSelection = () => {
    setSelectedFolders([])
    resetOperationState()
  }

  const renderState = (content: React.ReactNode) => {
    ;<div className={modalStyl}>{content}</div>
  }
}
