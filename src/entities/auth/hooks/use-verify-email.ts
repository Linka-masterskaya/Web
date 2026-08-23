import { useMutation } from '@tanstack/react-query'
import { verifyEmailApi } from '../api'

export const useVerifyEmail = () =>
  useMutation({
    mutationKey: ['auth', 'verify-email'],
    mutationFn: verifyEmailApi,
  })
