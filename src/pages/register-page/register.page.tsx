import { type TRegisterFormValues, useRegister } from '@entities/auth'
import { RegisterForm } from '@features/register'
import { Flex, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'
import styles from './register.page.module.scss'

export const RegisterPage = () => {
  const { mutateAsync: register } = useRegister()
  const navigate = useNavigate()

  const handleSubmit = async (_values: TRegisterFormValues) => {
    await register(_values)
    navigate(createUrl(routerPath.dashboard))
  }

  return (
    <Flex className={styles.content}>
      <Title order={1} className={styles.title}>
        Регистрация
      </Title>
      <RegisterForm onSubmit={handleSubmit} />
    </Flex>
  )
}
