import { z } from 'zod'

export const changeUserNameFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Введите имя' }),
})

export type TChangeUserNameFormValues = z.infer<typeof changeUserNameFormSchema>

export const changeUserNameFormDefaultValues: TChangeUserNameFormValues = {
  name: '',
}
