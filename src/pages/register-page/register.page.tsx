import { type TRegisterFormValues, useAuthStore } from '@entities/auth'
import { RegisterForm } from '@features/register'
import { Flex, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'
import styles from './register.page.module.scss'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (_values: TRegisterFormValues) => {
    // biome-ignore lint/suspicious/noConsole: debug only
    console.log('Данные регистрации:', _values)
    // TODO: интеграция с API
    await login()
    navigate(createUrl(routerPath.dashboard))
  }

  return (
    <Flex className={styles.content}>
      <Title order={1} className={styles.title}>
        Регистрация
      </Title>
      <RegisterForm onSubmit={handleSubmit} />
    </Flex>
  )
}
