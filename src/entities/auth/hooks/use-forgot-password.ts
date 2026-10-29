import { useMutation } from '@tanstack/react-query'

import { requestForgotPassword } from '../api'
import type { TForgotPasswordFormValues } from '../model'

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ['auth', 'forgot-password'],
    mutationFn: (values: TForgotPasswordFormValues) => requestForgotPassword(values),
  })
}
