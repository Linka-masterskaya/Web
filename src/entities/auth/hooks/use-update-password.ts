import { changeUserPassword, type TEditUserProfilePasswordFormValues } from '@entities/user'
import { useState } from 'react'

export const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updatePassword = async (values: TEditUserProfilePasswordFormValues) => {
    setIsLoading(true)

    try {
      await changeUserPassword(values)
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
