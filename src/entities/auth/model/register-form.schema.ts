import { z } from 'zod'

export const registerFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { message: 'Введите email' })
      .pipe(z.email({ message: 'Некорректный формат email' })),
    password: z.string().min(1, { message: 'Введите пароль' }),
    passwordConfirm: z.string().min(1, { message: 'Подтвердите пароль' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  })

export type TRegisterFormValues = z.infer<typeof registerFormSchema>

export const registerFormDefaultValues: TRegisterFormValues = {
  email: '',
  password: '',
  passwordConfirm: '',
}
