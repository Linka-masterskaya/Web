import type { TLoginFormValues } from '@entities/auth'
import { LoginForm } from '@features/login'

export const LoginPage = () => {
  const handleSubmit = async (values: TLoginFormValues) => {
    // biome-ignore lint/suspicious/noConsole: debug only
    console.log('Данные логина:', values)
    // TODO: интеграция с auth-store/API
  }

  return (
    <div>
      <LoginForm onSubmit={handleSubmit} />
    </div>
  )
}
