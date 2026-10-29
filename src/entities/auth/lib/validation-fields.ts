import { z } from 'zod'

export const emailField = z
  .string()
  .trim()
  .min(1, { message: 'Введите email' })
  .pipe(z.email({ message: 'Некорректный формат email' }))

export const passwordField = z
  .string()
  .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
  .max(72, { message: 'Пароль не должен превышать 72 символа' })

export const nameField = z
  .string()
  .trim()
  .min(2, { message: 'Имя должно содержать минимум 2 символа' })
  .max(100, { message: 'Имя не должно превышать 100 символов' })
