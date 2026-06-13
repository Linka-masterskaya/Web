import { z } from 'zod'
import { emailField } from './auth-form-fields.schema'

export const forgotPasswordFormSchema = z.object({
  email: emailField,
})

export type TForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

export const forgotPasswordFormDefaultValues: TForgotPasswordFormValues = {
  email: '',
}
