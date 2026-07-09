import { changeUserName, type TChangeUserNameFormValues } from '@entities/user'
import { useState } from 'react'

export const useUpdateUserName = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updateUserName = async (values: TChangeUserNameFormValues): Promise<boolean> => {
    setIsLoading(true)

    try {
      await changeUserName(values.name.trim())
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
    updateUserName,
    isLoading,
  }
}
