import { z } from 'zod'
import { emailField } from '../lib/validation-fields'

export const resendVerificationFormSchema = z.object({
  email: emailField,
})

export type TResendVerificationFormValues = z.infer<typeof resendVerificationFormSchema>

export const resendVerificationFormDefaultValues: TResendVerificationFormValues = {
  email: '',
}
