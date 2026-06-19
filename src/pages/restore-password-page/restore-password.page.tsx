import { ChangeUserPasswordForm } from '@features/change-user-password'
import { Box, Title } from '@mantine/core'
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
    <Box w="100%" maw={334}>
      <Title order={1} className={styles.title}>
        <span>Введите новый</span>
        <span>пароль</span>
      </Title>
      <ChangeUserPasswordForm onSubmit={handleSubmit} />
    </Box>
  )
}
