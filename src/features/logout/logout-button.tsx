import { useAuthStore } from '@entities/auth'
import { Button } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'

export const LogoutButton: React.FC = () => {
  const isAuth = useAuthStore((s) => s.isAuth)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(createUrl(routerPath.login))
  }

  return (
    <Button variant="outline" color="red" disabled={!isAuth} onClick={handleLogout}>
      Logout
    </Button>
  )
}
