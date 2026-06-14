import { passwordField } from '@entities/auth'
import { z } from 'zod'

export const changeUserPasswordFormSchema = z
  .object({
    newPassword: passwordField,
    passwordConfirm: z.string().min(1, { message: 'Введите пароль' }),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  })

export type TChangeUserPasswordFormValues = z.infer<typeof changeUserPasswordFormSchema>

export const changeUserPasswordFormDefaultValues: TChangeUserPasswordFormValues = {
  newPassword: '',
  passwordConfirm: '',
}
