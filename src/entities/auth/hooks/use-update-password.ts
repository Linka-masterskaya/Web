import type { TChangeUserPasswordFormValues } from '@entities/user'
import { useState } from 'react'
import { requestEditPassword } from '../api'

export const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updatePassword = async (values: TChangeUserPasswordFormValues) => {
    setIsLoading(true)

    try {
      await requestEditPassword({
        newPassword: values.newPassword,
        passwordConfirm: values.passwordConfirm,
      })
    } catch (err: unknown) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updatePassword,
    isLoading,
  }
}
