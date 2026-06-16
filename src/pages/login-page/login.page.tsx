import { type TLoginFormValues, useAuthStore } from '@entities/auth'
import { LoginForm } from '@features/login'
import { Box } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'

export const LoginPage = () => {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (_values: TLoginFormValues) => {
    await login()
    navigate(createUrl(routerPath.dashboard))
  }

  return (
    <Box w="100%" maw={334}>
      <LoginForm onSubmit={handleSubmit} />
    </Box>
  )
}
