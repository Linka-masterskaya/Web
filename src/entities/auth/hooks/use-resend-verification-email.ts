import { useMutation } from '@tanstack/react-query'
import { resendVerificationEmailApi } from '../api'

export const useResendVerificationEmail = () =>
  useMutation({
    mutationKey: ['auth', 'resend-verification-email'],
    mutationFn: resendVerificationEmailApi,
  })
