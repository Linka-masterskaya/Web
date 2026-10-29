import { z } from 'zod'

const fullNameRegex = /^[\p{L}]+ [\p{L}]+$/u

export const changeUserNameFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Введите имя и фамилию' }).regex(fullNameRegex, {
    message: 'Только имя и фамилия буквами, без цифр и знаков',
  }),
})

export type TChangeUserNameFormValues = z.infer<typeof changeUserNameFormSchema>

export const changeUserNameFormDefaultValues: TChangeUserNameFormValues = {
  name: '',
}
