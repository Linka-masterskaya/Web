import { EditNameForm, EditPasswordForm } from '@entities/auth/forms'
import {
  type TChangeUserNameFormValues,
  type TEditUserProfilePasswordFormValues,
  useUserStore,
} from '@entities/user'
import { Box } from '@mantine/core'
import { useState } from 'react'
import { useUpdatePassword } from './model/use-update-password'
import { useUpdateUserName } from './model/use-update-user-name'
import type { TUserNameViewMode, TUserProfileEditProps, TUserProfileEditView } from './types'

export const UserProfileEdit: React.FC<TUserProfileEditProps> = ({ className }) => {
  const name = useUserStore((state) => state.name)
  const email = useUserStore((state) => state.email)

  const [view, setView] = useState<TUserProfileEditView>('profile')
  const [nameViewMode, setNameViewMode] = useState<TUserNameViewMode>('view')

  const { updateUserName, isLoading: isUpdateNameLoading } = useUpdateUserName()

  const { updatePassword, isLoading: isUpdatePasswordLoading } = useUpdatePassword()

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
      setView('profile')
      setNameViewMode('view')
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
        />
      )}
    </Box>
  )
}
