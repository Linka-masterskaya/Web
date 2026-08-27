import { logoutApi, useAuthStore } from '@entities/auth'
import { useUserStore } from '@entities/user'
import { Button } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useState } from 'react'
import { useNavigate } from 'react-router'

type TLogoutButtonProps = {
  onAfterLogout?: () => void
}

export const LogoutButton: React.FC<TLogoutButtonProps> = ({ onAfterLogout }) => {
  const isAuth = useAuthStore((s) => s.isAuth)
  const logout = useAuthStore((s) => s.logout)
  const resetUser = useUserStore((s) => s.resetUser)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await logoutApi()
    } catch {
      // Локальный выход выполняем даже при ошибке API
    }

    logout()
    resetUser()
    onAfterLogout?.()
    navigate(createUrl(routerPath.auth))
  }

  return (
    <Button
      variant="outline"
      color="red"
      fullWidth
      loading={isLoading}
      disabled={!isAuth || isLoading}
      onClick={handleLogout}
    >
      Выйти
    </Button>
  )
}
