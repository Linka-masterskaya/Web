import {
  ForgotPasswordForm,
  type TForgotPasswordFormValues,
  useForgotPassword,
} from '@entities/auth'
import { Stack, Text } from '@mantine/core'
import { useState } from 'react'
import styles from './forgot-password.module.scss'

export const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { mutateAsync } = useForgotPassword()

  const handleSubmit = async (values: TForgotPasswordFormValues) => {
    await mutateAsync(values)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Stack gap="md">
        <Text size="sm" className={styles.successText}>
          Ваш запрос на восстановление пароля принят. Инструкция отправлена на Вашу почту.
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="md">
      <Text size="sm" className={styles.text}>
        Введите адрес электронной почты, которую вы использовали для регистрации в сервисе
      </Text>

      <ForgotPasswordForm onSubmit={handleSubmit} />
    </Stack>
  )
}
