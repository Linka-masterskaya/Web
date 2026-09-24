import { useFolders } from '@entities/folder'
import { useMoveSet, useSet } from '@entities/set'
import { ActionIcon, Button, Loader, Text, TextInput, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { type FormEvent, useState } from 'react'
import styles from './move-set-modal.module.scss'
import type { TMoveSetModalProps } from './types'

export const MoveSetModal: React.FC<TMoveSetModalProps> = ({ setId, onClose, onSuccess }) => {
  const foldersQuery = useFolders()
  const setQuery = useSet(setId)
  const moveSetMutation = useMoveSet()

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const folders = foldersQuery.data ?? []
  const currentFolderId = setQuery.data?.folderId

  const availableFolders = folders.filter(
    (folder) => folder.section !== 'library' && folder.id !== currentFolderId,
  )

  const normalizedSearch = search.trim().toLocaleLowerCase('ru')
  const visibleFolders = availableFolders.filter((folder) =>
    folder.name.toLocaleLowerCase('ru').includes(normalizedSearch),
  )

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId)
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

  const isSubmitDisabled = !selectedFolderId || selectedFolderId === currentFolderId
  const handleRetry = () => Promise.all([foldersQuery.refetch(), setQuery.refetch()])

  const renderState = (content: React.ReactNode) => <div className={styles.state}>{content}</div>

  return (
    <section className={styles.container} aria-labelledby="move-set-title">
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
        availableFolders.length === 0 &&
        renderState(<Text>Нет доступных папок</Text>)}

      {!isLoading && !isError && availableFolders.length > 0 && (
        <form className={styles.form} onSubmit={handleSubmit}>
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
              {visibleFolders.length > 0 ? (
                visibleFolders.map((folder) => (
                  <button
                    className={styles.childFolderButton}
                    type="button"
                    key={folder.id}
                    aria-pressed={folder.id === selectedFolderId}
                    disabled={moveSetMutation.isPending}
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    <Icon
                      name={folder.kind === 'student' ? 'UserRound' : 'Folder'}
                      size={20}
                      strokeWidth={1.75}
                    />
                    {folder.name}
                  </button>
                ))
              ) : (
                <Text className={styles.emptyChildren}>Ничего не найдено</Text>
              )}
            </div>
          </div>

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
