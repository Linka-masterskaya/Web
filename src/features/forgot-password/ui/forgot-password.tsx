import { ForgotPasswordForm, useForgotPassword } from '@entities/auth'

export const ForgotPassword: React.FC = () => {
  const { mutateAsync: forgotPassword } = useForgotPassword()

  return <ForgotPasswordForm onSubmit={forgotPassword} />
}
