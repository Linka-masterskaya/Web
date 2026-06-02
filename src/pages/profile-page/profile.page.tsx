import { LogoutButton } from '@features/logout'
import { MainMenu } from '@features/main-menu'
import { UserForm } from '@features/user-form'
import { Box, Flex, Title } from '@mantine/core'

export const ProfilePage: React.FC = () => (
  <Flex direction="column" align="flex-start" gap="lg" w="100%">
    <MainMenu />

    <Title w="100%" mt="lg">
      Profile
    </Title>

    <LogoutButton />

    <Box w="fit-content" mx="auto">
      <UserForm />
    </Box>
  </Flex>
)
