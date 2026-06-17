import { z } from 'zod'

export const passwordField = z
  .string()
  .min(1, { message: 'Введите пароль' })
  .min(8, { message: 'Пароль должен содержать не менее 8 символов' })
