import { UserAvatar } from '@features/user-avatar'
import { Box, CloseButton, Flex, Stack } from '@mantine/core'
import type { TUserProfileProps } from './types'
import styles from './user-profile.module.scss'
// import { UserProfileEdit } from '@features/user-profile-edit'

export const UserProfile = ({ onClose }: TUserProfileProps) => {
  return (
    <Box className={styles.container}>
      <CloseButton
        className={styles.closeButton}
        onClick={onClose}
        size="md"
        aria-label="Закрыть профиль"
      />
      <Stack gap="40px" align="stretch">
        <Flex justify="center">
          <UserAvatar />
        </Flex>
        {/* <UserProfileEdit /> */}
      </Stack>
    </Box>
  )
}
