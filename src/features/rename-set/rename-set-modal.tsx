import { useUpdateSetTitle } from '@entities/set'
import { Button, Flex, Text, TextInput, Title } from '@mantine/core'
import { PopupLayout } from '@shared/ui/popup-layout'
import { type FormEvent, useState } from 'react'

import styles from './rename-set-modal.module.scss'
import type { TRenameSetModalProps } from './types'

export const RenameSetModal: React.FC<TRenameSetModalProps> = ({
  setId,
  currentTitle,
  onClose,
  onSuccess,
}) => {
  const updateSetTitleMutation = useUpdateSetTitle(setId)
  const [title, setTitle] = useState(currentTitle)

  const trimmedTitle = title.trim()
  const canSubmit = Boolean(
    trimmedTitle && trimmedTitle !== currentTitle.trim() && !updateSetTitleMutation.isPending,
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    updateSetTitleMutation.mutate(trimmedTitle, {
      onSuccess: () => {
        onSuccess?.()
        onClose()
      },
    })
  }

  return (
    <PopupLayout onClose={onClose}>
      <Flex direction="column" className={styles.wrapper}>
        <Title order={2}>Переименовать набор</Title>

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            label="Название набора"
            placeholder="Введите название"
            value={title}
            onChange={(event) => {
              setTitle(event.currentTarget.value)
              updateSetTitleMutation.reset()
            }}
            data-autofocus
            required
          />

          {updateSetTitleMutation.isError && (
            <Text c="red.6" size="sm" role="alert">
              Не удалось переименовать набор. Попробуйте ещё раз.
            </Text>
          )}

          <Button
            type="submit"
            className={styles.submitButton}
            loading={updateSetTitleMutation.isPending}
            disabled={!canSubmit}
          >
            Сохранить
          </Button>
        </form>
      </Flex>
    </PopupLayout>
  )
}
