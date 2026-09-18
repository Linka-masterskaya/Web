import { apiClient } from '@shared/lib/api'
import { z } from 'zod'
import type { TEditUserProfilePasswordFormValues } from '../model/change-user-password-form.schema'
import { type TUserProfile, userProfileSchema } from '../model/user-profile.schema'
import { useUserStore } from '../model/user-store'

const profileResponseSchema = z
  .object({
    email: z.string().email(),
    display_name: z.string().nullable().optional(),
    avatar_url: z.string().nullable().optional(),
  })
  .transform((profile) => ({
    name: profile.display_name ?? null,
    email: profile.email,
    avatarSrc: profile.avatar_url ?? null,
  }))

export const getUserProfile = async (): Promise<TUserProfile> => {
  const profile = await apiClient.get('profile/me').json(userProfileSchema)

  useUserStore.getState().setUser({
    name: profile.name,
    email: profile.email,
    avatarSrc: profile.avatarUrl,
    role: profile.role,
  })

  return profile
}

export const changeUserName = async (name: string): Promise<void> => {
  const profile = await apiClient
    .patch('profile/me', {
      json: {
        display_name: name,
      },
    })
    .json(profileResponseSchema)

  useUserStore.getState().setUser(profile)
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
