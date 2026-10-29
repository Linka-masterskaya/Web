import { useRenameFolder } from '@entities/folder'
import { Button, Flex, Text, TextInput, Title } from '@mantine/core'
import { PopupLayout } from '@shared/ui/popup-layout'
import { type FormEvent, useState } from 'react'

import styles from './rename-folder-modal.module.scss'
import type { TRenameFolderModalProps } from './types'

export const RenameFolderModal: React.FC<TRenameFolderModalProps> = ({
  folderId,
  currentName,
  onClose,
  onSuccess,
}) => {
  const renameFolderMutation = useRenameFolder()
  const [name, setName] = useState(currentName)

  const trimmedName = name.trim()
  const canSubmit = Boolean(
    trimmedName && trimmedName !== currentName.trim() && !renameFolderMutation.isPending,
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    renameFolderMutation.mutate(
      {
        id: folderId,
        name: trimmedName,
      },
      {
        onSuccess: () => {
          onSuccess?.()
          onClose()
        },
      },
    )
  }

  return (
    <PopupLayout onClose={onClose}>
      <Flex direction="column" className={styles.wrapper}>
        <Title order={2}>Переименовать папку</Title>

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            label="Название папки"
            placeholder="Введите название"
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value)
              renameFolderMutation.reset()
            }}
            data-autofocus
            required
          />

          {renameFolderMutation.isError && (
            <Text c="red.6" size="sm" role="alert">
              Не удалось переименовать папку. Попробуйте ещё раз.
            </Text>
          )}

          <Button
            type="submit"
            className={styles.submitButton}
            loading={renameFolderMutation.isPending}
            disabled={!canSubmit}
          >
            Сохранить
          </Button>
        </form>
      </Flex>
    </PopupLayout>
  )
}
