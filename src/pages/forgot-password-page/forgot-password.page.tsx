import { ForgotPassword } from '@features/forgot-password'
import { CloseButton, Flex, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router'

import styles from './forgot-password.page.module.scss'

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()

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

        <ForgotPassword />
      </Flex>
    </Flex>
  )
}
