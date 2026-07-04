import { ActionIcon, Avatar, FileButton, Loader, Menu, Overlay, Text } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import styles from './avatar-upload.module.scss'
import type { TAvatarUploaderProps } from './types'

const DEFAULT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const AvatarUpload = ({
  avatarSrc,
  initials,
  onReplace,
  onDelete,
  acceptedMimeTypes = DEFAULT_MIME_TYPES,
  radius = '50%',
  menuTarget,
  isLoading = false,
  error = null,
}: TAvatarUploaderProps) => {
  const hasAvatar = !!avatarSrc
  const size = 120
  const accept = acceptedMimeTypes.join(',')

  const handleFileChange = (file: File | null) => {
    if (file) {
      onReplace(file)
    }
  }

  return (
    <div
      className={styles.avatarWrapper}
      style={{ '--avatar-radius': radius } as React.CSSProperties}
    >
      {isLoading && (
        <Overlay className={styles.overlay}>
          <Loader size="sm" />
        </Overlay>
      )}

      <Avatar src={avatarSrc} size={size} radius={radius}>
        {initials}
      </Avatar>

      {!hasAvatar && (
        <FileButton onChange={handleFileChange} accept={accept}>
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
            {menuTarget ?? (
              <ActionIcon variant="subtle" size="compact" className={styles.menuButton}>
                <Icon name="EllipsisVertical" size={16} className={styles.icon} />
              </ActionIcon>
            )}
          </Menu.Target>
          <Menu.Dropdown>
            <FileButton onChange={handleFileChange} accept={accept}>
              {(props) => (
                <Menu.Item {...props} c="gray.6">
                  Заменить фото
                </Menu.Item>
              )}
            </FileButton>
            <Menu.Divider />
            <Menu.Item onClick={onDelete} c="red.6">
              Удалить фото
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}

      {error && (
        <Text c="red" size="sm" className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  )
}
