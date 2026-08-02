import { useFolders } from '@entities/folder'
import { useMoveSet, useSet } from '@entities/set'
import { ActionIcon, Button, Loader, Text, TextInput, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import styles from './move-set-modal.module.scss'
import type { TMoveSetModalProps } from './types'

export const MoveSetModal: React.FC<TMoveSetModalProps> = ({ setId, onClose, onSuccess }) => {
  const foldersQuery = useFolders()
  const setQuery = useSet(setId)
  const moveSetMutation = useMoveSet()
  const [activeRootId, setActiveRootId] = useState<string | null>(null)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const folders = foldersQuery.data ?? []
  const rootFolders = useMemo(() => folders.filter((folder) => folder.parentId == null), [folders])
  const childrenByParentId = useMemo(() => {
    const result = new Map<string, typeof folders>()

    for (const folder of folders) {
      if (!folder.parentId) {
        continue
      }

      const siblings = result.get(folder.parentId) ?? []
      result.set(folder.parentId, [...siblings, folder])
    }

    return result
  }, [folders])
  const activeChildren = activeRootId ? (childrenByParentId.get(activeRootId) ?? []) : []
  const normalizedSearch = search.trim().toLocaleLowerCase('ru')
  const visibleChildren = activeChildren.filter((folder) =>
    folder.name.toLocaleLowerCase('ru').includes(normalizedSearch),
  )
  const currentFolderId = setQuery.data?.folderId

  useEffect(() => {
    if (activeRootId || rootFolders.length === 0) {
      return
    }

    const firstRoot = rootFolders[0]
    setActiveRootId(firstRoot.id)

    if (!childrenByParentId.has(firstRoot.id)) {
      setSelectedFolderId(firstRoot.id)
    }
  }, [activeRootId, childrenByParentId, rootFolders])

  const handleRootClick = (folderId: string) => {
    setActiveRootId(folderId)
    setSearch('')
    setSelectedFolderId(childrenByParentId.has(folderId) ? null : folderId)
    moveSetMutation.reset()
  }

  const handleChildClick = (folderId: string) => {
    setSelectedFolderId((currentId) => (currentId === folderId ? null : folderId))
    moveSetMutation.reset()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedFolderId || selectedFolderId === currentFolderId) {
      return
    }

    moveSetMutation.mutate(
      { setId, folderId: selectedFolderId },
      {
        onSuccess: () => {
          onSuccess?.()
          onClose()
        },
      },
    )
  }

  const isLoading = foldersQuery.isLoading || setQuery.isLoading
  const isError = foldersQuery.isError || setQuery.isError
  const isExpanded = activeChildren.length > 0
  const isSubmitDisabled = !selectedFolderId || selectedFolderId === currentFolderId
  const handleRetry = () => Promise.all([foldersQuery.refetch(), setQuery.refetch()])

  const renderState = (content: React.ReactNode) => <div className={styles.state}>{content}</div>

  return (
    <section
      className={clsx(styles.container, isExpanded && styles.expanded)}
      aria-labelledby="move-set-title"
    >
      <ActionIcon
        className={styles.closeButton}
        variant="subtle"
        size={32}
        onClick={onClose}
        disabled={moveSetMutation.isPending}
        aria-label="Отменить"
      >
        <Icon name="X" size={28} strokeWidth={1.75} />
      </ActionIcon>

      <Title id="move-set-title" className={styles.title} order={2}>
        Переместить в папку:
      </Title>

      {isLoading && renderState(<Loader aria-label="Загрузка папок" />)}

      {isError &&
        renderState(
          <>
            <Text role="alert">Не удалось загрузить папки</Text>
            <Button variant="outline" onClick={handleRetry}>
              Повторить
            </Button>
          </>,
        )}

      {!isLoading &&
        !isError &&
        rootFolders.length === 0 &&
        renderState(<Text>Нет доступных папок</Text>)}

      {!isLoading && !isError && rootFolders.length > 0 && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <fieldset className={styles.rootFolders} aria-label="Папки">
            {rootFolders.map((folder) => {
              const isActive = folder.id === activeRootId
              const hasChildren = childrenByParentId.has(folder.id)

              return (
                <button
                  className={styles.folderButton}
                  type="button"
                  key={folder.id}
                  aria-pressed={isActive}
                  disabled={moveSetMutation.isPending}
                  onClick={() => handleRootClick(folder.id)}
                >
                  <Icon name={hasChildren ? 'UserRound' : 'Folder'} size={24} strokeWidth={1.75} />
                  <span>{folder.name}</span>
                </button>
              )
            })}
          </fieldset>

          {isExpanded && (
            <div className={styles.childrenSection}>
              <TextInput
                aria-label="Поиск папки"
                placeholder="Поиск"
                value={search}
                disabled={moveSetMutation.isPending}
                onChange={(event) => {
                  setSearch(event.currentTarget.value)
                  setSelectedFolderId(null)
                  moveSetMutation.reset()
                }}
                leftSection={<Icon name="Search" size={20} />}
                classNames={{ input: styles.searchInput }}
              />

              <div className={styles.childFolders}>
                {visibleChildren.length > 0 ? (
                  visibleChildren.map((folder) => (
                    <button
                      className={styles.childFolderButton}
                      type="button"
                      key={folder.id}
                      aria-pressed={folder.id === selectedFolderId}
                      disabled={moveSetMutation.isPending}
                      onClick={() => handleChildClick(folder.id)}
                    >
                      {folder.name}
                    </button>
                  ))
                ) : (
                  <Text className={styles.emptyChildren}>Ничего не найдено</Text>
                )}
              </div>
            </div>
          )}

          {moveSetMutation.isError && (
            <Text className={styles.errorText} role="alert">
              Не удалось переместить набор. Попробуйте ещё раз.
            </Text>
          )}

          <Button
            className={styles.submitButton}
            type="submit"
            disabled={isSubmitDisabled}
            loading={moveSetMutation.isPending}
          >
            Переместить
          </Button>
        </form>
      )}
    </section>
  )
}
