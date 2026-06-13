import { Anchor, Flex, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Link } from 'react-router'

export const ForgotPasswordPage: React.FC = () => (
  <Flex direction="column" align="center" gap="md">
    <Title>Forgot password</Title>
    <Anchor component={Link} to={createUrl(routerPath.auth)}>
      Back to login
    </Anchor>
  </Flex>
)
