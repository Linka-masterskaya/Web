import { ResendEmailVerification } from '@features/resend-email-verification'
import { CloseButton, Flex, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useLocation, useNavigate } from 'react-router'
import styles from './resend-verification.page.module.scss'

type TResendVerificationLocationState = {
  email?: string
}

export const ResendVerificationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const locationState = location.state as TResendVerificationLocationState | null

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
        onClick={() => navigate(createUrl(routerPath.auth))}
        className={styles.closeButton}
      />

      <Flex direction="column" gap="20px" className={styles.contentInner}>
        <Title order={1} ta="center">
          Не пришло письмо?
        </Title>

        <ResendEmailVerification defaultEmail={locationState?.email} />
      </Flex>
    </Flex>
  )
}
