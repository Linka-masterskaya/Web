import { changeUserPassword, type TEditUserProfilePasswordFormValues } from '@entities/user'
import { useState } from 'react'

export const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updatePassword = async (values: TEditUserProfilePasswordFormValues): Promise<boolean> => {
    setIsLoading(true)

    try {
      await changeUserPassword(values)
      return true
    } catch (err: unknown) {
      // biome-ignore lint/suspicious/noConsole: debug only
      console.log(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updatePassword,
    isLoading,
  }
}
