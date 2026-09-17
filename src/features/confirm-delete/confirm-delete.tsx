import { Button, Flex, Text, Title } from '@mantine/core'
import { getApiErrorMessage } from '@shared/lib/api'
import { useModal } from '@shared/lib/modal'
import { Icon } from '@shared/ui/icon'
import { PopupLayout } from '@shared/ui/popup-layout'
import { useState } from 'react'
import styles from './confirm-delete.module.scss'
import type { TConfirmDeleteParams } from './types'

export const ConfirmDelete = ({
  title,
  description,
  onConfirm,
  getErrorMessage,
}: TConfirmDeleteParams) => {
  const { close } = useModal()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleConfirm = async () => {
    try {
      setError(null)
      setIsPending(true)

      await onConfirm()
      close()
    } catch (error) {
      const message = getErrorMessage
        ? await getErrorMessage(error)
        : await getApiErrorMessage(error)

      setError(message ?? 'Не удалось удалить')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <PopupLayout onClose={close}>
      <Flex direction="column" align="center" className={styles.wrapper}>
        <Icon name="Trash" size={60} color="var(--mantine-color-black)" strokeWidth={1} />

        <Title order={2} ta="center">
          {title}
        </Title>

        {description && <Text ta="center">{description}</Text>}

        {error && (
          <Text c="red.6" size="sm" ta="center">
            {error}
          </Text>
        )}

        <Flex direction="column" className={styles.buttonWrapper}>
          <Button
            className={styles.deleteButton}
            fullWidth
            onClick={handleConfirm}
            loading={isPending}
          >
            Удалить
          </Button>

          <Button variant="outline" fullWidth onClick={close} disabled={isPending}>
            Отменить
          </Button>
        </Flex>
      </Flex>
    </PopupLayout>
  )
}
