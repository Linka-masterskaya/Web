import { type TChangeUserNameFormValues, useUserStore } from '@entities/user'
import { useState } from 'react'
import { requestEditName } from '../api'

export const useUpdateUserName = () => {
  const setName = useUserStore((state) => state.setName)

  const [isLoading, setIsLoading] = useState(false)

  const updateUserName = async (values: TChangeUserNameFormValues) => {
    setIsLoading(true)

    try {
      const updatedName = await requestEditName({
        name: values.name.trim(),
      })

      setName(updatedName.name)
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
