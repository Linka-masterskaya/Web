import { useSectionFolders } from '@entities/folder'
import { usePublishSet } from '@entities/set'
import { ActionIcon, Button, Loader, Text, Title, UnstyledButton } from '@mantine/core'
import { getApiErrorMessage } from '@shared/lib/api'
import { Icon } from '@shared/ui/icon'
import { type FormEvent, useState } from 'react'
import styles from './publish-set-modal.module.scss'
import type { TPublishSetModalProps } from './types'

const FOLDER_INDENT_PX = 16

/** Публикация набора в Библиотеку: методист выбирает папку Библиотеки */
export const PublishSetModal: React.FC<TPublishSetModalProps> = ({ setId, onClose, onSuccess }) => {
  const foldersQuery = useSectionFolders('library')
  const { mutateAsync: publish, isPending } = usePublishSet()
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

      await publish({ setId, libraryFolderId: selectedFolderId })

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
    <section className={styles.container} aria-labelledby="publish-set-title">
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

      <Title id="publish-set-title" className={styles.title} order={2}>
        Опубликовать в Библиотеке:
      </Title>

      {foldersQuery.isLoading && renderState(<Loader aria-label="Загрузка папок" />)}

      {foldersQuery.isError &&
        renderState(
          <>
            <Text role="alert">Не удалось загрузить папки Библиотеки</Text>
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
            В Библиотеке пока нет папок. Создайте папку в разделе «Библиотека» и повторите.
          </Text>,
        )}

      {!foldersQuery.isLoading && !foldersQuery.isError && folders.length > 0 && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <fieldset className={styles.folders} aria-label="Папки Библиотеки">
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
                <Icon name="Folder" size={20} strokeWidth={1.75} />
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
            Опубликовать
          </Button>
        </form>
      )}
    </section>
  )
}
