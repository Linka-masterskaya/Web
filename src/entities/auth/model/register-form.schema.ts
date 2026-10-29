import { z } from 'zod'
import { emailField, nameField, passwordField } from '../lib/validation-fields'

export const registerFormSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
    passwordConfirm: z.string().min(1, { message: 'Подтвердите пароль' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  })

export type TRegisterFormValues = z.infer<typeof registerFormSchema>

export const registerFormDefaultValues: TRegisterFormValues = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
}
