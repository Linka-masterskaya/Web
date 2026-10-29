import { changeUserPassword, type TEditUserProfilePasswordFormValues } from '@entities/user'
import { isHTTPError } from 'ky'
import { useState } from 'react'

export const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const clearErrorMessage = () => {
    setErrorMessage(null)
  }

  const updatePassword = async (values: TEditUserProfilePasswordFormValues): Promise<boolean> => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await changeUserPassword(values)
      return true
    } catch (err: unknown) {
      if (isHTTPError(err)) {
        if (err.response.status === 400) {
          setErrorMessage('Старый пароль указан неверно.')
        } else if (err.response.status === 401) {
          setErrorMessage('Сессия истекла. Войдите снова.')
        } else {
          setErrorMessage('Не удалось сменить пароль. Попробуйте ещё раз.')
        }
      } else {
        setErrorMessage('Не удалось сменить пароль. Попробуйте ещё раз.')
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updatePassword,
    isLoading,
    errorMessage,
    clearErrorMessage,
  }
}
