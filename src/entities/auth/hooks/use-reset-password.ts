import type { TChangeUserPasswordFormValues } from '@entities/user'
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '../api'

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ['auth', 'password-reset'],
    mutationFn: ({ token, values }: { token: string; values: TChangeUserPasswordFormValues }) =>
      resetPassword(token, values),
  })
}
