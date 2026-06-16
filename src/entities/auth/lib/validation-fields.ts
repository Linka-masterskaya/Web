import { z } from 'zod'

export const emailField = z
  .string()
  .trim()
  .min(1, { message: 'Введите email' })
  .pipe(z.email({ message: 'Некорректный формат email' }))

export const passwordField = z.string().min(1, { message: 'Введите пароль' })
