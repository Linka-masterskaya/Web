import { uploadMedia } from '@entities/media'
import { useStudent, useUpdateStudent } from '@entities/student'
import { useEffect, useRef, useState } from 'react'

type TUseStudentAvatarOptions = {
  studentId: string
}

export const useStudentAvatar = ({ studentId }: TUseStudentAvatarOptions) => {
  const { data: student, isLoading: isStudentLoading, error: studentError } = useStudent(studentId)
  const { mutateAsync: updateStudent, isPending: isMutationLoading } = useUpdateStudent()

  const [localError, setLocalError] = useState<string | null>(null)

  // Храним ссылку на временный URL для отмены при размонтировании/ошибке
  const tempUrlRef = useRef<string | null>(null)

  // Отзываем blob URL при размонтировании, если handleFileChange ещё в полёте
  useEffect(() => {
    return () => {
      if (tempUrlRef.current) {
        URL.revokeObjectURL(tempUrlRef.current)
      }
    }
  }, [])

  const avatarSrc = student?.avatar_url ?? null
  const isLoading = isStudentLoading || isMutationLoading
  const error = localError ?? studentError?.message ?? null

  const handleFileChange = async (file: File) => {
    const tempUrl = URL.createObjectURL(file)
    tempUrlRef.current = tempUrl
    setLocalError(null)

    try {
      const media = await uploadMedia(file)
      await updateStudent({ id: studentId, data: { avatar_media_id: media.id } })
    } catch (err) {
      setLocalError('Не удалось обновить фото')
      // biome-ignore lint/suspicious/noConsole: debug only
      console.error('Не удалось обновить аватар ученика:', err)
    } finally {
      URL.revokeObjectURL(tempUrl)
      tempUrlRef.current = null
    }
  }

  const handleDelete = async () => {
    setLocalError(null)

    try {
      await updateStudent({ id: studentId, data: { avatar_media_id: null } })
    } catch (err) {
      setLocalError('Не удалось удалить фото')
      // biome-ignore lint/suspicious/noConsole: debug only
      console.error('Не удалось удалить аватар ученика:', err)
    }
  }

  return {
    avatarSrc,
    isLoading,
    error,
    handleFileChange,
    handleDelete,
  }
}
