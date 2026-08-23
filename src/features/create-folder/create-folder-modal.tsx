import { useCreateFolder } from '@entities/folder'
import { Button, Flex, Text, TextInput, Title } from '@mantine/core'
import { PopupLayout } from '@shared/ui/popup-layout'
import { type FormEvent, useState } from 'react'
import { z } from 'zod'

import styles from './create-folder-modal.module.scss'
import type { TCreateFolderModalProps } from './types'

const parentIdSchema = z.string().uuid()

export const CreateFolderModal: React.FC<TCreateFolderModalProps> = ({
  section = 'my',
  parentId = null,
  onClose,
  onSuccess,
}) => {
  const createFolderMutation = useCreateFolder()
  const [name, setName] = useState('')

  const parsedParentId = parentIdSchema.safeParse(parentId ?? undefined)
  const resolvedParentId = parsedParentId.success ? parsedParentId.data : null
  const canSubmit = Boolean(name.trim() && !createFolderMutation.isPending)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName || createFolderMutation.isPending) {
      return
    }

    createFolderMutation.mutate(
      {
        name: trimmedName,
        section,
        parentId: resolvedParentId,
        kind: 'folder',
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
        <Title order={2}>Новая папка</Title>

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            label="Название папки"
            placeholder="Введите название"
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value)
              createFolderMutation.reset()
            }}
            data-autofocus
            required
          />

          {createFolderMutation.isError && (
            <Text c="red.6" size="sm" role="alert">
              Не удалось создать папку. Попробуйте ещё раз.
            </Text>
          )}

          <Button
            type="submit"
            className={styles.submitButton}
            loading={createFolderMutation.isPending}
            disabled={!canSubmit}
          >
            Создать
          </Button>
        </form>
      </Flex>
    </PopupLayout>
  )
}
