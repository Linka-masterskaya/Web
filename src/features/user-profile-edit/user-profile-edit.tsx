import { EditNameForm, EditPasswordForm } from '@entities/auth/forms'
import { useUpdatePassword, useUpdateUserName } from '@entities/auth/hooks'
import type { TChangeUserNameFormValues, TEditUserProfilePasswordFormValues } from '@entities/user'
import { CloseButton } from '@mantine/core'
import { useState } from 'react'
import type { FormMode, TUserProfileEditProps } from './types'
import styles from './user-profile-edit.module.scss'

export const UserProfileEdit: React.FC<TUserProfileEditProps> = ({ onClose }) => {
  const [mode, setMode] = useState<FormMode>('profile')

  const { updateUserName, isLoading: isUpdateNameLoading } = useUpdateUserName()

  const { updatePassword, isLoading: isUpdatePasswordLoading } = useUpdatePassword()

  const handleProfileSubmit = async (values: TChangeUserNameFormValues) => {
    await updateUserName(values)

    console.log('Имя изменено на: ', values.name)
  }

  const handleUpdatePasswordSubmit = async (values: TEditUserProfilePasswordFormValues) => {
    await updatePassword(values)

    console.log('Пароль изменен')
  }

  const openPasswordForm = () => {
    setMode('password')
  }

  return (
    <div className={styles.profileContainer}>
      <CloseButton
        aria-label="Вернуться на страницу входа"
        size="lg"
        onClick={onClose}
        className={styles.closeButton}
      />
      <div>Здесь будет фото юзера</div>

      {mode === 'profile' ? (
        <EditNameForm
          onSubmit={handleProfileSubmit}
          openPasswordForm={openPasswordForm}
          isLoading={isUpdateNameLoading}
        />
      ) : (
        <EditPasswordForm
          onSubmit={handleUpdatePasswordSubmit}
          isLoading={isUpdatePasswordLoading}
        />
      )}
    </div>
  )
}
