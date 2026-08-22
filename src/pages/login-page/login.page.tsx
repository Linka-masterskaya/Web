import { type TLoginFormValues, useLogin } from '@entities/auth'
import {
  EMAIL_VERIFICATION_NOTICE_STATE_KEY,
  EmailVerificationNotice,
  emailVerificationNoticeModalOptions,
} from '@features/email-verification-notice'
import { LoginForm } from '@features/login'
import { Title } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import styles from './login.page.module.scss'

type TLoginPageLocationState = {
  [EMAIL_VERIFICATION_NOTICE_STATE_KEY]?: boolean
}

export const LoginPage = () => {
  const { mutateAsync: login } = useLogin()
  const location = useLocation()
  const navigate = useNavigate()
  const { open } = useModal()
  const hasOpenedNotice = useRef(false)
  const locationState = location.state as TLoginPageLocationState | null
  const shouldShowNotice = locationState?.[EMAIL_VERIFICATION_NOTICE_STATE_KEY] === true

  useEffect(() => {
    if (!shouldShowNotice || hasOpenedNotice.current) {
      return
    }

    hasOpenedNotice.current = true
    open({
      content: <EmailVerificationNotice />,
      ...emailVerificationNoticeModalOptions,
    })
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, navigate, open, shouldShowNotice])

  const handleSubmit = async (values: TLoginFormValues) => {
    await login(values)
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
