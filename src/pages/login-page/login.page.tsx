import { type TLoginFormValues, useAuthStore } from '@entities/auth'
import { LoginForm } from '@features/login'
import { Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'
import styles from './login.page.module.scss'

export const LoginPage = () => {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (_values: TLoginFormValues) => {
    await login()
    navigate(createUrl(routerPath.dashboard))
  }

  return (
    <div className={styles.content}>
      <Title order={1} className={styles.title}>
        Войти
      </Title>
      <LoginForm onSubmit={handleSubmit} />
    </div>
  )
}
