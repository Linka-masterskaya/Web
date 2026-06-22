import { ForgotPasswordForm, type TForgotPasswordFormValues } from '@entities/auth'
import { CloseButton, Flex, Text, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import styles from './forgot-password.page.module.scss'

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleGoToLogin = () => {
    navigate(createUrl(routerPath.auth))
  }

  const handleSubmit = async (_values: TForgotPasswordFormValues) => {
    setIsSubmitted(true) // форма пока что никуда не отправляется
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

      <Flex direction="column" gap="20px" className={styles.contentInner}>
        <Title order={1} ta="center">
          Забыли пароль?
        </Title>

        {isSubmitted ? (
          <Text size="sm" className={styles.successText}>
            Ваш запрос на восстановление пароля принят. Инструкция отправлена на Вашу почту.
          </Text>
        ) : (
          <>
            <Text size="sm" className={styles.text}>
              Введите адрес электронной почты, которую вы использовали для регистрации в сервисе
            </Text>

            <ForgotPasswordForm onSubmit={handleSubmit} />
          </>
        )}
      </Flex>
    </Flex>
  )
}
