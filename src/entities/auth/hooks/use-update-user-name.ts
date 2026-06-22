import { changeUserName, type TChangeUserNameFormValues, useUserStore } from '@entities/user'
import { useState } from 'react'

export const useUpdateUserName = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updateUserName = async (values: TChangeUserNameFormValues) => {
    setIsLoading(true)

    try {
      await changeUserName(values.name.trim())
    } catch (err: unknown) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateUserName,
    isLoading,
  }
}
