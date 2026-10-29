import { AvatarUpload } from '@shared/ui/avatar'
import { useAvatarUpload } from '../model'

export const UserAvatar = () => {
  const { avatarSrc, displayName, isLoading, error, handleFileChange, handleDelete } =
    useAvatarUpload()

  return (
    <AvatarUpload
      avatarSrc={avatarSrc}
      initials={displayName}
      onReplace={handleFileChange}
      onDelete={handleDelete}
      radius="50%"
      isLoading={isLoading}
      error={error}
    />
  )
}
