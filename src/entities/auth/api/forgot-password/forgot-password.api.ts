import { apiClient } from '@shared/lib/api'
import type { TForgotPasswordFormValues } from '../../model'

export const requestForgotPassword = async (values: TForgotPasswordFormValues): Promise<void> => {
  await apiClient.post('auth/password/forgot', {
    json: values,
  })
}
