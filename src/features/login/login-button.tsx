import { useAuthStore } from '@entities/auth'
import { Button } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'

export const LoginButton: React.FC = () => {
  const isAuth = useAuthStore((s) => s.isAuth)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleLogin = async () => {
    await login()
    navigate(createUrl(routerPath.dashboard))
  }

  return (
    <Button disabled={isAuth} onClick={handleLogin}>
      Login
    </Button>
  )
}
