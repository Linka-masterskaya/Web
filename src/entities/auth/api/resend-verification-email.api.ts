import { apiClient } from '@shared/lib/api'
import type { TResendVerificationFormValues } from '../model/resend-verification-form.schema'

export const resendVerificationEmailApi = async (
  values: TResendVerificationFormValues,
): Promise<void> => {
  await apiClient.post('auth/verify-email/resend', { json: values })
}
