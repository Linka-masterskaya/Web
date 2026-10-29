import {
  acceptedAvatarMimeTypes,
  changeUserAvatarFormDefaultValues,
  changeUserAvatarFormSchema,
  type TChangeUserAvatarFormValues,
} from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, Button, FileButton, Group, Stack, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export type TChangeUserAvatarFormProps = {
  currentAvatarSrc?: string | null
  onSubmit: (values: TChangeUserAvatarFormValues) => void | Promise<void>
}

export const ChangeUserAvatarForm = ({
  currentAvatarSrc,
  onSubmit,
}: TChangeUserAvatarFormProps) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  const form = useForm<TChangeUserAvatarFormValues>({
    resolver: zodResolver(changeUserAvatarFormSchema),
    defaultValues: changeUserAvatarFormDefaultValues,
    mode: 'onSubmit',
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  useEffect(() => {
    if (!previewSrc) {
      return
    }

    return () => {
      URL.revokeObjectURL(previewSrc)
    }
  }, [previewSrc])

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="sm" align="center">
        <Controller
          control={control}
          name="avatar"
          render={({ field }) => {
            const handleChange = (file: File | null) => {
              setPreviewSrc((current) => {
                if (current) {
                  URL.revokeObjectURL(current)
                }
                return file ? URL.createObjectURL(file) : null
              })
              field.onChange(file)
            }

            return (
              <Group gap="md" align="center">
                <Avatar src={previewSrc ?? currentAvatarSrc} size={96} radius="50%" />
                <FileButton onChange={handleChange} accept={acceptedAvatarMimeTypes.join(',')}>
                  {(props) => (
                    <Button {...props} variant="outline">
                      {currentAvatarSrc ? 'Изменить фото' : 'Загрузить фото'}
                    </Button>
                  )}
                </FileButton>
              </Group>
            )
          }}
        />

        {errors.avatar?.message && <Text c="red">{errors.avatar.message}</Text>}

        <Button type="submit" loading={isSubmitting}>
          Сохранить
        </Button>
      </Stack>
    </form>
  )
}
