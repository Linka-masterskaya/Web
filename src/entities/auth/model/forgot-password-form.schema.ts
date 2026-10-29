import { z } from 'zod'
import { emailField } from '../lib/validation-fields'

export const forgotPasswordFormSchema = z.object({
  email: emailField,
})

export type TForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

export const forgotPasswordFormDefaultValues: TForgotPasswordFormValues = {
  email: '',
}
