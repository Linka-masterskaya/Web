import { z } from 'zod'

export const emailField = z
  .string()
  .trim()
  .min(1, { message: 'Введите email' })
  .pipe(z.email({ message: 'Введите корректный email' }))
