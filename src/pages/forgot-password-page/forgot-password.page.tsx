import { ForgotPassword } from '@features/forgot-password'
import { CloseButton, Flex, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'
import styles from './forgot-password.page.module.scss'

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToLogin = () => {
    navigate(createUrl(routerPath.auth))
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

        <ForgotPassword />
      </Flex>
    </Flex>
  )
}
