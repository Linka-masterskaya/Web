import { type TRegisterFormValues, useRegister } from '@entities/auth'
import { EMAIL_VERIFICATION_NOTICE_STATE_KEY } from '@features/email-verification-notice'
import { RegisterForm } from '@features/register'
import { CloseButton, Flex, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'
import styles from './register.page.module.scss'

export const RegisterPage = () => {
  const { mutateAsync: register } = useRegister()
  const navigate = useNavigate()

  const handleSubmit = async (values: TRegisterFormValues) => {
    await register(values)
    navigate(createUrl(routerPath.auth), {
      state: { [EMAIL_VERIFICATION_NOTICE_STATE_KEY]: true },
    })
  }

  return (
    <Flex className={styles.content}>
      <CloseButton
        aria-label="Вернуться на страницу входа"
        size="lg"
        onClick={() => navigate(createUrl(routerPath.auth))}
        className={styles.closeButton}
      />

      <Title order={1} className={styles.title}>
        Регистрация
      </Title>
      <RegisterForm onSubmit={handleSubmit} />
    </Flex>
  )
}
