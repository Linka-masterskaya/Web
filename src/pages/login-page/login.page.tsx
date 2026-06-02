import { LoginButton } from '@features/login'
import { Anchor, Flex, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Link } from 'react-router'

export const LoginPage: React.FC = () => (
  <Flex direction="column" align="center" gap="md">
    <Title>Login</Title>

    <LoginButton />

    <Anchor component={Link} to={createUrl(routerPath.forgotPassword)}>
      Forgot password?
    </Anchor>
  </Flex>
)
