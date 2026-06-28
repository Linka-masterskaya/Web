import { z } from 'zod'

export const acceptedAvatarMimeTypes = ['image/jpeg', 'image/png', 'image/webp']

export const maxAvatarFileSizeBytes = 5 * 1024 * 1024

export const changeUserAvatarFormSchema = z.object({
  avatar: z
    .instanceof(File, { message: 'Выберите изображение' })
    .refine((file) => acceptedAvatarMimeTypes.includes(file.type), {
      message: 'Неподдерживаемый формат файла',
    })
    .refine((file) => file.size <= maxAvatarFileSizeBytes, {
      message: 'Файл слишком большой',
    }),
})

export type TChangeUserAvatarFormValues = z.infer<typeof changeUserAvatarFormSchema>

export const changeUserAvatarFormDefaultValues = {
  avatar: undefined,
} satisfies Partial<TChangeUserAvatarFormValues>
