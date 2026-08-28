import { useResetPassword } from '@entities/auth/hooks'
import type { TChangeUserPasswordFormValues } from '@entities/user'
import { ChangeUserPasswordForm } from '@features/change-user-password'
import { Box, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate, useSearchParams } from 'react-router'
import styles from './restore-password.module.css'

export const RestorePasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutateAsync } = useResetPassword()

  const token = searchParams.get('token')

  const handleSubmit = async (values: TChangeUserPasswordFormValues) => {
    if (!token) {
      return
    }

    await mutateAsync({
      token,
      values,
    })

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
