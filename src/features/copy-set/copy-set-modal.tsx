import { useSectionFolders } from '@entities/folder'
import { useDuplicateSet } from '@entities/set'
import { ActionIcon, Button, Loader, Text, Title, UnstyledButton } from '@mantine/core'
import { getApiErrorMessage } from '@shared/lib/api'
import { Icon } from '@shared/ui/icon'
import { type FormEvent, useState } from 'react'
import styles from './copy-set-modal.module.scss'
import type { TCopySetModalProps } from './types'

const FOLDER_INDENT_PX = 16

/**
 * Копирование набора из Библиотеки в свои папки.
 * Обычному пользователю доступно только копирование: набор из Библиотеки редактировать нельзя.
 */
export const CopySetModal: React.FC<TCopySetModalProps> = ({
  setId,
  targetSection,
  onClose,
  onSuccess,
}) => {
  const foldersQuery = useSectionFolders(targetSection)
  const { mutateAsync: duplicateSet, isPending } = useDuplicateSet()
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const folders = foldersQuery.data ?? []

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId((currentId) => (currentId === folderId ? null : folderId))
    setActionError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedFolderId) {
      return
    }

    try {
      setActionError(null)

      await duplicateSet({ setId, folderId: selectedFolderId })

      onSuccess?.()
      onClose()
    } catch (error) {
      setActionError(await getApiErrorMessage(error))
    }
  }

  const handleRetry = () => {
    void foldersQuery.refetch()
  }

  const renderState = (content: React.ReactNode) => <div className={styles.state}>{content}</div>

  return (
    <section className={styles.container} aria-labelledby="copy-set-title">
      <ActionIcon
        className={styles.closeButton}
        variant="subtle"
        size={32}
        onClick={onClose}
        disabled={isPending}
        aria-label="Отменить"
      >
        <Icon name="X" size={28} strokeWidth={1.75} />
      </ActionIcon>

      <Title id="copy-set-title" className={styles.title} order={2}>
        {targetSection === 'students' ? 'Скопировать в папку ученика:' : 'Скопировать в мои папки:'}
      </Title>

      {foldersQuery.isLoading && renderState(<Loader aria-label="Загрузка папок" />)}

      {foldersQuery.isError &&
        renderState(
          <>
            <Text role="alert">Не удалось загрузить папки</Text>
            <Button variant="outline" onClick={handleRetry}>
              Повторить
            </Button>
          </>,
        )}

      {!foldersQuery.isLoading &&
        !foldersQuery.isError &&
        folders.length === 0 &&
        renderState(
          <Text>
            {targetSection === 'students'
              ? 'Нет доступных папок учеников.'
              : 'В «Мои наборы» пока нет папок. Создайте папку и повторите копирование.'}
          </Text>,
        )}

      {!foldersQuery.isLoading && !foldersQuery.isError && folders.length > 0 && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <fieldset
            className={styles.folders}
            aria-label={targetSection === 'students' ? 'Папки учеников' : 'Мои папки'}
          >
            {folders.map((folder) => (
              <UnstyledButton
                className={styles.folderButton}
                key={folder.id}
                type="button"
                style={{ paddingLeft: folder.depth * FOLDER_INDENT_PX }}
                aria-pressed={folder.id === selectedFolderId}
                disabled={isPending}
                onClick={() => handleSelectFolder(folder.id)}
              >
                <Icon
                  name={folder.kind === 'student' ? 'UserRound' : 'Folder'}
                  size={20}
                  strokeWidth={1.75}
                />
                <span>{folder.name}</span>
              </UnstyledButton>
            ))}
          </fieldset>

          {actionError && (
            <Text className={styles.errorText} role="alert">
              {actionError}
            </Text>
          )}

          <Button
            className={styles.submitButton}
            type="submit"
            disabled={!selectedFolderId}
            loading={isPending}
          >
            Скопировать
          </Button>
        </form>
      )}
    </section>
  )
}
