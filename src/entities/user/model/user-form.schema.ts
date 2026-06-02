import { z } from 'zod'

export const userFormSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'First name is required' }),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .pipe(z.email({ message: 'Invalid email address' })),
  privacyPolicy: z.boolean().refine((value) => value === true, {
    message: 'Privacy policy consent is required',
  }),
})

export type TUserFormValues = z.infer<typeof userFormSchema>

export const userFormDefaultValues: TUserFormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  privacyPolicy: false,
}
