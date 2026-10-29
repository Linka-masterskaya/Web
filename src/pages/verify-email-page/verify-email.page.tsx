import { useVerifyEmail } from '@entities/auth'
import { Button, Loader, Stack, Text, Title } from '@mantine/core'
import { createUrl, routerPath, useRouteQueryParams } from '@shared/lib/routes'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import styles from './verify-email.page.module.scss'

export const VerifyEmailPage = () => {
  const { queryParams } = useRouteQueryParams()
  const { mutate: verifyEmail, isIdle, isPending, isSuccess } = useVerifyEmail()
  const hasRequestedVerification = useRef(false)
  const token = queryParams.token

  useEffect(() => {
    if (!token || hasRequestedVerification.current) {
      return
    }

    hasRequestedVerification.current = true
    verifyEmail(token)
  }, [token, verifyEmail])

  if (!token) {
    return (
      <Stack className={styles.content} align="center" gap="md">
        <Title order={1}>Не удалось подтвердить email</Title>
        <Text>В ссылке отсутствует токен подтверждения.</Text>
        <Button component={Link} to={createUrl(routerPath.auth)}>
          Перейти ко входу
        </Button>
      </Stack>
    )
  }

  if (isIdle || isPending) {
    return (
      <Stack className={styles.content} align="center" gap="md">
        <Loader aria-label="Подтверждаем email" />
        <Text>Подтверждаем ваш email…</Text>
      </Stack>
    )
  }

  if (isSuccess) {
    return (
      <Stack className={styles.content} align="center" gap="md">
        <Title order={1}>Email подтверждён</Title>
        <Text>Регистрация успешно завершена.</Text>
        <Button component={Link} to={createUrl(routerPath.auth)}>
          Перейти ко входу
        </Button>
      </Stack>
    )
  }

  return (
    <Stack className={styles.content} align="center" gap="md">
      <Title order={1}>Не удалось подтвердить email</Title>
      <Text>Ссылка недействительна или срок её действия истёк.</Text>
      <Button component={Link} to={createUrl(routerPath.auth)}>
        Перейти ко входу
      </Button>
    </Stack>
  )
}
