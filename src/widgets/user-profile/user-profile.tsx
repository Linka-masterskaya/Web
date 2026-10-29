import { getUserProfile, useUserStore } from '@entities/user'
import { LogoutButton } from '@features/logout'
import { UserAvatar } from '@features/user-avatar'
import { UserProfileEdit } from '@features/user-profile-edit'
import { Box, CloseButton, Flex, Loader, Stack, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import type { TUserProfileProps } from './types'
import styles from './user-profile.module.scss'

export const UserProfile = ({ onClose }: TUserProfileProps) => {
  const resetUser = useUserStore((state) => state.resetUser)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let isCancelled = false

    const loadProfile = async () => {
      try {
        await getUserProfile()
        if (!isCancelled) {
          setStatus('ready')
        }
      } catch {
        if (!isCancelled) {
          resetUser()
          setStatus('error')
        }
      }
    }

    void loadProfile()

    return () => {
      isCancelled = true
    }
  }, [resetUser])

  return (
    <Box className={styles.container}>
      <CloseButton
        className={styles.closeButton}
        onClick={onClose}
        size="md"
        aria-label="Закрыть профиль"
      />
      <Stack gap="40px" align="stretch" className={styles.content}>
        {status === 'loading' && (
          <Flex justify="center">
            <Loader aria-label="Загрузка профиля" />
          </Flex>
        )}
        {status === 'error' && (
          <Text c="red.6" size="sm" role="alert">
            Не удалось загрузить профиль. Закройте панель и откройте снова.
          </Text>
        )}
        {status === 'ready' && (
          <>
            <Flex justify="center">
              <UserAvatar />
            </Flex>
            <UserProfileEdit />
          </>
        )}
        <LogoutButton onAfterLogout={onClose} />
      </Stack>
    </Box>
  )
}
