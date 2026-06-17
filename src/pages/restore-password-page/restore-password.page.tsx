import { ChangeUserPasswordForm } from '@features/change-user-password'
import { Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'
import styles from './restore-password.module.css'

export const RestorePasswordPage = () => {
  const navigate = useNavigate()

  const handleSubmit = async () => {
    // TODO: заглушка — после успешной смены пароля редирект на логин
    // Заменить на вызов API смены пароля с проверкой токена из письма
    navigate(createUrl(routerPath.auth), { replace: true })
  }

  return (
    <div>
      <Title order={1} className={styles.title}>
        Введите новый
        <br />
        пароль
      </Title>
      <ChangeUserPasswordForm onSubmit={handleSubmit} />
    </div>
  )
}
