import { nameField } from '@entities/auth/lib/validation-fields'
import { z } from 'zod'

export const changeUserNameFormSchema = z.object({
  name: nameField,
})

export type TChangeUserNameFormValues = z.infer<typeof changeUserNameFormSchema>

export const changeUserNameFormDefaultValues: TChangeUserNameFormValues = {
  name: '',
}
