import { changeUserAvatar, deleteUserAvatar, useUserStore } from '@entities/user'
import { ActionIcon, Avatar, FileButton, Menu } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { USER_AVATAR_ACCEPTED_MIME_TYPES } from '../config'
import styles from './user-avatar.module.scss'

export const UserAvatar = () => {
  const { avatarSrc, setAvatarSrc, name, email } = useUserStore()

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      return
    }
    const previousAvatar = avatarSrc
    const tempUrl = URL.createObjectURL(file)
    // оптимистичное обновление аватара - на случай длительного ответа от сервера
    setAvatarSrc(tempUrl)

    try {
      const response = await changeUserAvatar(file)
      setAvatarSrc(response.avatarUrl)
    } catch (error) {
      setAvatarSrc(previousAvatar)
      // biome-ignore lint/suspicious/noConsole: debug only
      console.error('Не удалось обновить аватар:', error)
    } finally {
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl)
      }
    }
  }

  const handleDelete = async () => {
    const previousAvatar = avatarSrc
    setAvatarSrc(null)

    try {
      await deleteUserAvatar()
    } catch (error) {
      setAvatarSrc(previousAvatar)
      // biome-ignore lint/suspicious/noConsole: debug only
      console.error('Не удалось удалить аватар:', error)
    }
  }

  const hasAvatar = !!avatarSrc

  const displayName = name?.[0] || email?.[0] || ' '

  return (
    <div className={styles.avatarWrapper}>
      <Avatar src={avatarSrc} size={120} radius="50%">
        {displayName}
      </Avatar>
      {!hasAvatar && (
        <FileButton onChange={handleFileChange} accept={USER_AVATAR_ACCEPTED_MIME_TYPES.join(',')}>
          {(props) => (
            <ActionIcon {...props} variant="subtle" size="compact" className={styles.addButton}>
              <Icon name="ImagePlus" size={16} className={styles.icon} />
            </ActionIcon>
          )}
        </FileButton>
      )}

      {hasAvatar && (
        <Menu position="bottom-start" keepMounted>
          <Menu.Target>
            <ActionIcon variant="subtle" size="compact" className={styles.menuButton}>
              <Icon name="EllipsisVertical" size={16} className={styles.icon} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <FileButton
              onChange={handleFileChange}
              accept={USER_AVATAR_ACCEPTED_MIME_TYPES.join(',')}
            >
              {(props) => (
                <Menu.Item {...props} c="gray.6">
                  Заменить фото
                </Menu.Item>
              )}
            </FileButton>
            <Menu.Divider />
            <Menu.Item onClick={handleDelete} c="red">
              Удалить фото
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  )
}
