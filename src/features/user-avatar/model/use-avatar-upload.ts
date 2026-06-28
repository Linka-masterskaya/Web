import { changeUserAvatar, deleteUserAvatar, useUserStore } from '@entities/user'
import { useState } from 'react'

export const useAvatarUpload = () => {
  const { avatarSrc, setAvatarSrc, name, email } = useUserStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      return
    }
    const previousAvatar = avatarSrc
    const tempUrl = URL.createObjectURL(file)
    setIsLoading(true)
    setError(null)
    // оптимистичное обновление аватара - на случай длительного ответа от сервера
    setAvatarSrc(tempUrl)

    try {
      const response = await changeUserAvatar(file)
      setAvatarSrc(response.avatarUrl)
    } catch (error) {
      setAvatarSrc(previousAvatar)
      // biome-ignore lint/suspicious/noConsole: debug only
      console.error('Не удалось обновить аватар:', error)
    } finally {
      setIsLoading(false)
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl)
      }
    }
  }

  const handleDelete = async () => {
    const previousAvatar = avatarSrc
    setIsLoading(true)
    setError(null)
    setAvatarSrc(null)

    try {
      await deleteUserAvatar()
    } catch (error) {
      setAvatarSrc(previousAvatar)
      // biome-ignore lint/suspicious/noConsole: debug only
      console.error('Не удалось удалить аватар:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const hasAvatar = !!avatarSrc

  const displayName = name?.[0] || email?.[0] || ' '

  return {
    avatarSrc,
    hasAvatar,
    displayName,
    isLoading,
    error,
    handleFileChange,
    handleDelete,
  }
}
