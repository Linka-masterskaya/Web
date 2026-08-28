import { useAuthStore } from '@entities/auth'
import { EditNameForm, EditPasswordForm } from '@entities/auth/forms'
import {
  type TChangeUserNameFormValues,
  type TEditUserProfilePasswordFormValues,
  useUserStore,
} from '@entities/user'
import { Box } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useUpdatePassword } from './model/use-update-password'
import { useUpdateUserName } from './model/use-update-user-name'
import type { TUserNameViewMode, TUserProfileEditProps, TUserProfileEditView } from './types'

export const UserProfileEdit: React.FC<TUserProfileEditProps> = ({ className }) => {
  const name = useUserStore((state) => state.name)
  const email = useUserStore((state) => state.email)
  const logout = useAuthStore((state) => state.logout)
  const resetUser = useUserStore((state) => state.resetUser)
  const navigate = useNavigate()

  const [view, setView] = useState<TUserProfileEditView>('profile')
  const [nameViewMode, setNameViewMode] = useState<TUserNameViewMode>('view')

  const { updateUserName, isLoading: isUpdateNameLoading } = useUpdateUserName()

  const {
    updatePassword,
    isLoading: isUpdatePasswordLoading,
    errorMessage: updatePasswordError,
    clearErrorMessage,
  } = useUpdatePassword()

  const handleProfileSubmit = async (values: TChangeUserNameFormValues) => {
    const isSuccess = await updateUserName(values)

    if (isSuccess) {
      setNameViewMode('view')
    }

    return isSuccess
  }

  const handleUpdatePasswordSubmit = async (values: TEditUserProfilePasswordFormValues) => {
    const isSuccess = await updatePassword(values)

    if (isSuccess) {
      logout()
      resetUser()
      navigate(createUrl(routerPath.auth), { replace: true })
    }

    return isSuccess
  }

  const openPasswordForm = () => {
    setView('changePassword')
    setNameViewMode('view')
  }

  return (
    <Box className={className}>
      {view === 'profile' ? (
        <EditNameForm
          name={name ?? ''}
          email={email ?? ''}
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
          submitError={updatePasswordError}
          onFieldChange={clearErrorMessage}
        />
      )}
    </Box>
  )
}
