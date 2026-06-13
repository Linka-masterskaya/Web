import type { TForgotPasswordFormValues } from '@entities/auth'

import { ForgotPasswordForm } from '@features/forgot-password'
import { Flex, Text, Title } from '@mantine/core'
import { useEffect, useRef } from 'react'

export const ForgotPasswordPage: React.FC = () => {
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
  return (
    <Flex direction="column" align="center" justify="center" w="100%" h="100%" gap="20px">
      <Title order={1}>Забыли пароль?</Title>
      <Text>
        Введите адрес электронной почты, которую вы использовали для регистрации в сервисе
      </Text>

      <ForgotPasswordForm onSubmit={handleForgotPasswordSubmit} />
    </Flex>
  )
}
