import type { TRegisterFormValues } from '@entities/auth'
import { RegisterForm } from '@features/register'
import { Flex, Title } from '@mantine/core'

export const RegisterPage = () => {
  const handleSubmit = async (values: TRegisterFormValues) => {
    // biome-ignore lint/suspicious/noConsole: debug only
    console.log('Данные регистрации:', values)
    // TODO: интеграция с API
  }

  return (
    <Flex direction="column" align="center" gap="md">
      <Title>Регистрация</Title>
      <RegisterForm onSubmit={handleSubmit} />
    </Flex>
  )
}
