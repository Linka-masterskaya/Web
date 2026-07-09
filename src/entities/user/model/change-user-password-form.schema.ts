import { z } from 'zod'

const passwordField = z
  .string()
  .min(1, { message: 'Введите пароль' })
  .min(8, { message: 'Пароль должен содержать не менее 8 символов' })

export const oldPasswordSchema = z.string().min(1, 'Введите старый пароль')

// схема для страницы восстановления пароля
export const changeUserPasswordFormSchema = z
  .object({
    newPassword: passwordField,
    passwordConfirm: passwordField,
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

// схема для смены пароля в блоке пользователя
export const editUserProfilePasswordFormSchema = z
  .object({
    oldPassword: oldPasswordSchema,
    newPassword: passwordField,
    passwordConfirm: passwordField,
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  })

export type TEditUserProfilePasswordFormValues = z.infer<typeof editUserProfilePasswordFormSchema>

export const editUserProfilePasswordFormSchemaDefaultValues: TEditUserProfilePasswordFormValues = {
  oldPassword: '',
  newPassword: '',
  passwordConfirm: '',
}
