import { useCreateSet } from '@entities/set'
import { Button, Flex, Text, TextInput, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { PopupLayout } from '@shared/ui/popup-layout'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'

import styles from './create-set-modal.module.scss'
import type { TCreateSetModalProps } from './types'

const folderIdSchema = z.string().uuid()

export const CreateSetModal: React.FC<TCreateSetModalProps> = ({
  folderId = null,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate()
  const createSetMutation = useCreateSet()
  const [title, setTitle] = useState('')

  const parsedFolderId = folderIdSchema.safeParse(folderId ?? undefined)
  const resolvedFolderId = parsedFolderId.success ? parsedFolderId.data : null
  const canSubmit = Boolean(resolvedFolderId && title.trim() && !createSetMutation.isPending)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!resolvedFolderId || !trimmedTitle || createSetMutation.isPending) {
      return
    }

    createSetMutation.mutate(
      {
        title: trimmedTitle,
        folderId: resolvedFolderId,
      },
      {
        onSuccess: (set) => {
          onSuccess?.()
          onClose()
          navigate(createUrl(routerPath.dashboardSetId, { setId: set.id }))
        },
      },
    )
  }

  return (
    <PopupLayout onClose={onClose}>
      <Flex direction="column" className={styles.wrapper}>
        <Title order={2}>Новый набор</Title>

        {!resolvedFolderId && (
          <Text c="red.6" size="sm" role="alert">
            Набор можно создать только внутри папки. Откройте папку и попробуйте снова.
          </Text>
        )}

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
            disabled={!resolvedFolderId}
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
            disabled={!canSubmit}
          >
            Создать
          </Button>
        </form>
      </Flex>
    </PopupLayout>
  )
}
