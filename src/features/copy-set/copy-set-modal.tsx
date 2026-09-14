import { type TFolderTreeItem, useFolderChildren } from '@entities/folder'
import { ActionIcon, Button, Loader, Text, TextInput, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import { HTTPError } from 'ky'
import { type FormEvent, useMemo, useState } from 'react'
import type { TCopySetTargetSection } from './copy-set.schema'
import styles from './copy-set-modal.module.scss'
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

  const renderState = (content: React.ReactNode) => <div className={styles.state}>{content}</div>

  const isLoading = folderQuery.isLoading
  const isError = folderQuery.isError

  const emptyText =
    search.trim().length > 0
      ? 'Ничего не найдено'
      : currentFolder
        ? 'Вложенных папок нет'
        : 'Нет доступных папок'

  const submitLabel =
    selectedFolders.length <= 1 ? 'Копировать' : `Копировать (${selectedFolders.length})`

  return (
    <section className={clsx(styles.container, className)} aria-labelledby="copy-set-title">
      <ActionIcon
        className={styles.closeButton}
        variant="subtle"
        size={24}
        onClick={handleClose}
        disabled={copySetMutation.isPending}
        aria-label="Закрыть"
      >
        <Icon name="X" size={24} />
      </ActionIcon>

      <Title id="copy-set-title" className={styles.title} order={2}>
        {targetSection === 'my' ? 'Копировать в Мои наборы' : 'Копировать в папку ученика'}
      </Title>

      {setName && (
        <Text size="sm" c="dimmer">
          Набор: {setName}
        </Text>
      )}

      {isLoading && renderState(<Loader aria-label="Загрузка папок" />)}

      {isError &&
        renderState(
          <>
            <Text role="alert">Не удалось загрузить папки</Text>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void folderQuery.refetch()
              }}
            >
              Повторить
            </Button>
          </>,
        )}

      {!isLoading && !isError && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.navigation}>
            <Button
              type="button"
              variant="subtle"
              size="xs"
              disabled={path.length === 0 || copySetMutation.isPending}
              onClick={handleGoBack}
            >
              Назад
            </Button>

            <div className={styles.navigationInfo}>
              <Text size="xs" c="dimmed">
                Текущий раздел
              </Text>
              <Text className={styles.currentPath} size="sm" fw={600} title={currentPathLabel}>
                {currentPathLabel}
              </Text>
            </div>
          </div>

          {currentFolderOption && (
            <button
              className={clsx(styles.recipient, styles.currentFolderOption)}
              type="button"
              aria-pressed={selectedFolderIds.has(currentFolderOption.id)}
              disabled={copySetMutation.isPending}
              onClick={() => handleToggleFolder(currentFolderOption)}
            >
              <span className={styles.recipientName}>Копировать в текущую папку</span>
              <span className={styles.recipientEmail}>
                {selectedFolderIds.has(currentFolderOption.id)
                  ? 'Папка выбрана'
                  : currentFolderOption.name}
              </span>
            </button>
          )}

          <TextInput
            aria-label="Поиск папки"
            placeholder="Поиск"
            value={search}
            disabled={copySetMutation.isPending}
            onChange={handleSearchChange}
            leftSection={<Icon name="Search" size={20} />}
            classNames={{ input: styles.searchInput }}
          />

          <div className={styles.recipients}>
            {visibleFolders.length > 0 ? (
              visibleFolders.map((folder) => {
                const selecedFolder = createSelectedFolder(folder)
                const isSelected = selectedFolderIds.has(folder.id)

                return (
                  <div className={styles.folderRow} key={folder.id}>
                    <button
                      className={clsx(styles.recipient, styles.folderChoice)}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={copySetMutation.isPending}
                      onClick={() => handleToggleFolder(selecedFolder)}
                    >
                      <span className={styles.folderTitle}>
                        <Icon
                          name={folder.kind === 'student' ? 'UserRound' : 'Folder'}
                          size={20}
                          strokeWidth={1.75}
                        />
                        <span className={styles.recipientName}>{folder.name}</span>
                      </span>

                      {isSelected && <span className={styles.recipientEmail}>Выбрано</span>}
                    </button>

                    <Button
                      className={styles.openFolderButton}
                      type="button"
                      variant="subtle"
                      size="xs"
                      disabled={copySetMutation.isPending}
                      onClick={() => handleOpenFolder(folder)}
                      aria-label={`Открыть папку "${folder.name}"`}
                    >
                      Открыть
                    </Button>
                  </div>
                )
              })
            ) : (
              <Text className={styles.emptyRecipients}>{emptyText}</Text>
            )}
          </div>

          {selectedFolders.length > 0 && (
            <div className={styles.selectedBlock}>
              <div className={styles.selectedHeader}>
                <Text size="sm" fw={600}>
                  Выбрано папок: {selectedFolders.length}
                </Text>

                <Button
                  type="button"
                  size="xs"
                  variant="subtle"
                  disabled={copySetMutation.isPending}
                  onClick={handleClearSelection}
                >
                  Очистить
                </Button>
              </div>

              <div className={styles.selectedList}>
                {selectedFolders.map((folder) => (
                  <div className={styles.selectedItem} key={folder.id}>
                    <Text className={styles.selectedPath} size="xs" title={folder.pathLabel}>
                      {folder.pathLabel}
                    </Text>

                    <ActionIcon
                      type="button"
                      variant="subtle"
                      size={24}
                      disabled={copySetMutation.isPending}
                      onClick={() => handleToggleFolder(folder)}
                      aria-label={`Убрать папку"${folder.name}"`}
                    >
                      <Icon name="X" size={16} />
                    </ActionIcon>
                  </div>
                ))}
              </div>
            </div>
          )}

          {feedback && (
            <Text className={feedback.type === 'error' ? styles.errorText : styles.warningText}>
              {feedback.message}
            </Text>
          )}

          <Button
            className={styles.submitButton}
            type="submit"
            disabled={selectedFolders.length === 0}
            loading={copySetMutation.isPending}
          >
            {submitLabel}
          </Button>
        </form>
      )}
    </section>
  )
}
