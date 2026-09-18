import { apiClient } from '@shared/lib/api'
import type { TEditUserProfilePasswordFormValues } from '../model/change-user-password-form.schema'
import { type TUserProfile, userProfileSchema } from '../model/user-profile.schema'
import { useUserStore } from '../model/user-store'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getUserProfile = async (): Promise<TUserProfile> => {
  return apiClient.get('profile/me').json(userProfileSchema)
}

export const changeUserName = async (name: string): Promise<void> => {
  await delay(500)

  useUserStore.getState().setName(name)
}

export const changeUserPassword = async (
  values: TEditUserProfilePasswordFormValues,
): Promise<void> => {
  await apiClient.post('profile/me/password', {
    json: {
      current_password: values.oldPassword,
      new_password: values.newPassword,
    },
  })
}
