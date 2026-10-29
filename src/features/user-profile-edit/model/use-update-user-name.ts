import { changeUserName, type TChangeUserNameFormValues } from '@entities/user'
import { isHTTPError } from 'ky'
import { useState } from 'react'

export const useUpdateUserName = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const clearErrorMessage = () => {
    setErrorMessage(null)
  }
  const updateUserName = async (values: TChangeUserNameFormValues): Promise<boolean> => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await changeUserName(values.name.trim())
      return true
    } catch (err: unknown) {
      if (isHTTPError(err) && err.response.status === 401) {
        setErrorMessage('Сессия истекла. Войдите снова.')
      } else {
        setErrorMessage('Не удалось сохранить имя. Попробуйте ещё раз.')
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateUserName,
    isLoading,
    errorMessage,
    clearErrorMessage,
  }
}
