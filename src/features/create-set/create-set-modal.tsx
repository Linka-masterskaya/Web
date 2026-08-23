import { useCreateSet } from '@entities/set'
import { Button, Flex, Text, TextInput, Title } from '@mantine/core'
import { PopupLayout } from '@shared/ui/popup-layout'
import { type FormEvent, useState } from 'react'

import styles from './create-set-modal.module.scss'
import type { TCreateSetModalProps } from './types'

export const CreateSetModal: React.FC<TCreateSetModalProps> = ({
  folderId = null,
  onClose,
  onSuccess,
}) => {
  const createSetMutation = useCreateSet()
  const [title, setTitle] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle || createSetMutation.isPending) {
      return
    }

    createSetMutation.mutate(
      {
        title: trimmedTitle,
        folderId: folderId || null,
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
        <Title order={2}>Новый набор</Title>

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            label="Название набора"
            placeholder="Введите название"
            value={title}
            onChange={(event) => {
              setTitle(event.currentTarget.value)
              createSetMutation.reset()
            }}
            data-autofocus
            required
          />

          {createSetMutation.isError && (
            <Text c="red.6" size="sm" role="alert">
              Не удалось создать набор. Попробуйте ещё раз.
            </Text>
          )}

          <Button
            type="submit"
            className={styles.submitButton}
            loading={createSetMutation.isPending}
            disabled={!title.trim()}
          >
            Создать
          </Button>
        </form>
      </Flex>
    </PopupLayout>
  )
}
