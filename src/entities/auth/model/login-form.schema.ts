import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Введите email' })
    .pipe(z.email({ message: 'Некорректный формат email' })),
  password: z.string().min(1, { message: 'Введите пароль' }),
  // TODO: уточнить правила валидации
})

export type TLoginFormValues = z.infer<typeof loginFormSchema>

export const loginFormDefaultValues: TLoginFormValues = {
  email: '',
  password: '',
}
