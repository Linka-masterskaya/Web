import type { TForgotPasswordFormValues } from '@entities/auth'

export type TForgotPasswordFormProps = {
  onSubmit: (values: TForgotPasswordFormValues) => void | Promise<void>
}
