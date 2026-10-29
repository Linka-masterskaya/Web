import type { TForgotPasswordFormValues } from '@entities/auth'

export type TForgotPasswordFormProps = {
  onSubmit: (values: TForgotPasswordFormValues) => unknown | Promise<unknown>
}
