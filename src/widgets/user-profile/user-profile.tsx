import { CloseButton, Stack } from '@mantine/core'
import type { TUserProfileProps } from './types'
import styles from './user-profile.module.scss'

export const UserProfile = ({ onClose }: TUserProfileProps) => {
  return (
    <Stack className={styles.container} align="center">
      <CloseButton className={styles.closeButton} onClick={onClose} size="md" />
      {/* TODO: добавить <UserAvatar /> */}
      {/* TODO: добавить <UserProfileEdit /> */}
    </Stack>
  )
}
