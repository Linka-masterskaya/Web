import { apiClient } from '@shared/lib/api'
import { getApiErrorMessage } from '@shared/lib/error'
import { z } from 'zod'

const changeUserAvatarResponseSchema = z
  .object({
    avatar_url: z.string().min(1),
  })
  .transform((response) => ({
    avatarUrl: response.avatar_url,
  }))

const FALLBACK_ERROR_MESSAGE = 'Что-то пошло не так. Попробуйте ещё раз.'

export const changeUserAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    return await apiClient
      .put('profile/me/avatar', { body: formData })
      .json(changeUserAvatarResponseSchema)
  } catch (error) {
    throw new Error(getApiErrorMessage(error) ?? FALLBACK_ERROR_MESSAGE)
  }
}

export const deleteUserAvatar = async (): Promise<void> => {
  try {
    await apiClient.delete('profile/me/avatar')
  } catch (error) {
    throw new Error(getApiErrorMessage(error) ?? FALLBACK_ERROR_MESSAGE)
  }
}
