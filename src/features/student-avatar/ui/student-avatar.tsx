import { AvatarUpload } from '@shared/ui/avatar'
import { Icon } from '@shared/ui/icon'
import { useStudentAvatar } from '../model'

export type TStudentAvatarProps = {
  /** ID ученика для чтения и обновления аватара */
  studentId: string
}

export const StudentAvatar = ({ studentId }: TStudentAvatarProps) => {
  const { avatarSrc, isLoading, error, handleFileChange, handleDelete } = useStudentAvatar({
    studentId,
  })

  return (
    <AvatarUpload
      avatarSrc={avatarSrc}
      initials={<Icon name="UserRound" size={50} color="var(--mantine-color-blue-4)" />}
      onReplace={handleFileChange}
      onDelete={handleDelete}
      radius="var(--mantine-radius-default)"
      isLoading={isLoading}
      error={error}
    />
  )
}
