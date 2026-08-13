import { apiClient } from '@shared/lib/api'
import { HTTPError } from 'ky'
import { z } from 'zod'

const changeUserAvatarResponseSchema = z
  .object({
    avatar_url: z.string().min(1),
  })
  .transform((response) => ({
    avatarUrl: response.avatar_url,
  }))

type TApiErrorBody = {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

const FALLBACK_ERROR_MESSAGE = 'Что-то пошло не так. Попробуйте ещё раз.'

const getServerErrorMessage = async (error: unknown): Promise<string> => {
  if (!(error instanceof HTTPError)) {
    return FALLBACK_ERROR_MESSAGE
  }

  try {
    const body = (await error.response.clone().json()) as Partial<TApiErrorBody>

    if (typeof body?.error?.message === 'string') {
      return body.error.message
    }
  } catch {}

  return FALLBACK_ERROR_MESSAGE
}

export const changeUserAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    return await apiClient
      .put('profile/me/avatar', { body: formData })
      .json(changeUserAvatarResponseSchema)
  } catch (error) {
    throw new Error(await getServerErrorMessage(error))
  }
}

export const deleteUserAvatar = async (): Promise<void> => {
  try {
    await apiClient.delete('profile/me/avatar')
  } catch (error) {
    throw new Error(await getServerErrorMessage(error))
  }
}
