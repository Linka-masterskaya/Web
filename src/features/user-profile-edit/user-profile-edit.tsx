import { EditNameForm, EditPasswordForm } from '@entities/auth/forms'
import { useUpdatePassword, useUpdateUserName } from '@entities/auth/hooks'
import type { TChangeUserNameFormValues, TEditUserProfilePasswordFormValues } from '@entities/user'
import { CloseButton } from '@mantine/core'
import { useState } from 'react'
import type { TUserNameViewMode, TUserProfileEditProps, TUserProfileEditView } from './types'
import styles from './user-profile-edit.module.scss'

export const UserProfileEdit: React.FC<TUserProfileEditProps> = ({ onClose }) => {
  const [view, setView] = useState<TUserProfileEditView>('profile')
  const [nameViewMode, setNameViewMode] = useState<TUserNameViewMode>('view')

  const { updateUserName, isLoading: isUpdateNameLoading } = useUpdateUserName()

  const { updatePassword, isLoading: isUpdatePasswordLoading } = useUpdatePassword()

  const handleProfileSubmit = async (values: TChangeUserNameFormValues) => {
    await updateUserName(values)

    setNameViewMode('view')

    console.log('Имя изменено на: ', values.name)
  }

  const handleUpdatePasswordSubmit = async (values: TEditUserProfilePasswordFormValues) => {
    await updatePassword(values)

    setView('profile')
    setNameViewMode('view')

    console.log('Пароль изменен')
  }

  const openPasswordForm = () => {
    setView('changePassword')
    setNameViewMode('view')
  }

  const handleClose = () => {
    setView('profile')
    setNameViewMode('view')
    onClose()
  }

  return (
    <div className={styles.profileContainer}>
      <CloseButton
        aria-label="Закрыть профиль"
        size="lg"
        onClick={handleClose}
        className={styles.closeButton}
      />
      <div>Здесь будет фото юзера</div>

      {view === 'profile' ? (
        <EditNameForm
          onSubmit={handleProfileSubmit}
          openPasswordForm={openPasswordForm}
          isLoading={isUpdateNameLoading}
          nameViewMode={nameViewMode}
          onEditNameClick={() => setNameViewMode('edit')}
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
