import { z } from 'zod'
import { emailField, passwordField } from '../lib/validation-fields'

export const loginFormSchema = z.object({
  email: emailField,
  password: passwordField,
  // TODO: уточнить правила валидации
})

export type TLoginFormValues = z.infer<typeof loginFormSchema>

export const loginFormDefaultValues: TLoginFormValues = {
  email: '',
  password: '',
}
