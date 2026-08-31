import type { TChangeUserPasswordFormValues } from '@entities/user'
import { apiClient } from '@shared/lib/api'

export const resetPassword = async (
  token: string,
  values: TChangeUserPasswordFormValues,
): Promise<void> => {
  await apiClient.post('auth/password/reset', {
    json: {
      token,
      new_password: values.newPassword,
    },
  })
}
