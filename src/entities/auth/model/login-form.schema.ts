import { z } from 'zod'

export const passwordField = z
  .string()
  .min(1, { message: 'Введите пароль' })
  .min(6, { message: 'Пароль должен содержать не менее 6 символов' })
