import { Button, Flex, Text, Title } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { Icon } from '@shared/ui/icon'
import { PopupLayout } from '@shared/ui/popup-layout'

import styles from './confirm-delete.module.scss'
import type { TConfirmDeleteParams } from './types'

export const ConfirmDelete = ({ title, description, onConfirm }: TConfirmDeleteParams) => {
  const { close } = useModal()

  const handleConfirm = () => {
    onConfirm()
    close()
  }

  return (
    <PopupLayout onClose={close}>
      <Flex direction="column" align="center" className={styles.wrapper}>
        <Icon name="Trash" size={60} color="var(--mantine-color-black)" strokeWidth={1} />

        <Title order={2} ta="center">
          {title}
        </Title>

        {description && <Text ta="center">{description}</Text>}

        <Flex direction="column" className={styles.buttonWrapper}>
          <Button className={styles.deleteButton} fullWidth onClick={handleConfirm}>
            Удалить
          </Button>

          <Button variant="outline" fullWidth onClick={close}>
            Отменить
          </Button>
        </Flex>
      </Flex>
    </PopupLayout>
  )
}
