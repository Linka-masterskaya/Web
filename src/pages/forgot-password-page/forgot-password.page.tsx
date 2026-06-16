import type { TForgotPasswordFormValues } from '@entities/auth'

import { ForgotPasswordForm } from '@features/forgot-password'
import { CloseButton, Flex, Text, Title } from '@mantine/core'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

import styles from './forgot-password.page.module.scss'

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  // TODO: здесь должны быть какая-то логика для отправки запроса на смену пароля,
  // но пока что тут имитация, чтобы кнопка делала вид, что запрос идет
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  const handleForgotPasswordSubmit = (values: TForgotPasswordFormValues) => {
    return new Promise<void>((resolve) => {
      timeoutRef.current = setTimeout(() => {
        console.log('Forgot password form values:', values)

        timeoutRef.current = null

        resolve()
      }, 2000)
    })
  }

  const handleGoToLogin = () => {
    navigate('/auth')
  }

  return (
    <Flex
      component="section"
      direction="column"
      align="center"
      justify="center"
      w="100%"
      mih="100dvh"
      className={styles.content}
    >
      <CloseButton
        aria-label="Вернуться на страницу входа"
        size="lg"
        onClick={handleGoToLogin}
        className={styles.closeButton}
      />

      <Flex direction="column" align="center" gap="20px" className={styles.contentInner}>
        <Title order={1} ta="center">
          Забыли пароль?
        </Title>

        <Text size="sm" className={styles.text}>
          Введите адрес электронной почты, которую вы использовали для регистрации в сервисе
        </Text>

        <ForgotPasswordForm onSubmit={handleForgotPasswordSubmit} />
      </Flex>
    </Flex>
  )
}
