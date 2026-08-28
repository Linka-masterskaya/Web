import { apiClient } from '@shared/lib/api'
import type { TEditUserProfilePasswordFormValues } from '../model/change-user-password-form.schema'
import { useUserStore } from '../model/user-store'

export const DEMO_USER_PROFILE = {
  name: 'Татьяна Т',
  email: 'mail@email.ru',
  avatarSrc: null,
} as const

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getUserProfile = async (): Promise<typeof DEMO_USER_PROFILE> => {
  await delay(500)

  useUserStore.getState().setUser(DEMO_USER_PROFILE)

  return DEMO_USER_PROFILE
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
