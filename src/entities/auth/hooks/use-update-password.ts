import type { TEditUserProfilePasswordFormValues } from '@entities/user'
import { useState } from 'react'
import { requestEditPassword } from '../api'

export const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updatePassword = async (values: TEditUserProfilePasswordFormValues) => {
    setIsLoading(true)

    try {
      await requestEditPassword({
        oldPassword: values.oldPassword,
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
