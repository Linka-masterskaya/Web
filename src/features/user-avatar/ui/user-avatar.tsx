import { ActionIcon, Avatar, FileButton, Loader, Menu, Overlay, Text } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { USER_AVATAR_ACCEPTED_MIME_TYPES } from '../config'
import { useAvatarUpload } from '../model'
import styles from './user-avatar.module.scss'

export const UserAvatar = () => {
  const { avatarSrc, hasAvatar, displayName, isLoading, error, handleFileChange, handleDelete } =
    useAvatarUpload()

  return (
    <div className={styles.avatarWrapper}>
      {isLoading && (
        <Overlay color="#fff" backgroundOpacity={0.6} blur={2} zIndex={1} radius="50%">
          <Loader size="sm" />
        </Overlay>
      )}
      {error && (
        <Text c="red" size="sm">
          {error}
        </Text>
      )}
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
